import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { GetPaymentMethodDto } from './dto/get-payment-method.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentMethodService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-05-28.basil',
      },
    );
  }

  async createPaymentMethod(userId: string, dto: CreatePaymentMethodDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: dto.subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== userId) {
      // Nothing
      throw new ForbiddenException(
        'You are not allowed to add payment methods to this subscription',
      );
    }

    try {
      // If we have a Stripe payment method ID, attach it to the customer
      if (dto.stripePaymentMethodId) {
        const customer = await this.getOrCreateStripeCustomer(userId);

        await this.stripe.paymentMethods.attach(dto.stripePaymentMethodId, {
          customer: customer.id,
        });

        // Set as default if specified
        if (dto.isDefault) {
          await this.stripe.customers.update(customer.id, {
            invoice_settings: {
              default_payment_method: dto.stripePaymentMethodId,
            },
          });
        }
      }

      // Create payment method in our database
      const { stripeCustomerId: _, ...paymentMethodData } = dto;
      return this.prisma.paymentMethod.create({
        data: paymentMethodData,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to create payment method: ${error.message}`,
      );
    }
  }

  async getPaymentMethod(
    dto: GetPaymentMethodDto,
    userId: string,
    requesterRole: string,
  ) {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        OR: [{ id: dto.id }, { subscriptionId: dto.subscriptionId }],
      },
      include: {
        subscription: true,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    if (
      paymentMethod.subscription.userId !== userId &&
      requesterRole !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You are not allowed to view this payment method',
      );
    }

    return paymentMethod;
  }

  async updatePaymentMethod(
    id: string,
    dto: UpdatePaymentMethodDto,
    userId: string,
    requesterRole: string,
  ) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
      include: {
        subscription: true,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    if (
      paymentMethod.subscription.userId !== userId &&
      requesterRole !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this payment method',
      );
    }

    try {
      // Handle Stripe updates if needed
      if (dto.stripePaymentMethodId && dto.isDefault) {
        const customer = await this.getOrCreateStripeCustomer(userId);
        await this.stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: dto.stripePaymentMethodId,
          },
        });
      }

      return this.prisma.paymentMethod.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update payment method: ${error.message}`,
      );
    }
  }

  async deletePaymentMethod(id: string, userId: string, requesterRole: string) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
      include: {
        subscription: true,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    if (
      paymentMethod.subscription.userId !== userId &&
      requesterRole !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this payment method',
      );
    }

    try {
      // Delete from Stripe if it exists there
      const paymentMethodData = await this.prisma.paymentMethod.findUnique({
        where: { id },
      });

      if (paymentMethodData?.stripePaymentMethodId) {
        await this.stripe.paymentMethods.detach(
          paymentMethodData.stripePaymentMethodId,
        );
      }

      return this.prisma.paymentMethod.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete payment method: ${error.message}`,
      );
    }
  }

  async getSubscriptionPaymentMethods(subscriptionId: string, userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to view these payment methods',
      );
    }

    return this.prisma.paymentMethod.findMany({
      where: { subscriptionId },
    });
  }

  private async getOrCreateStripeCustomer(
    userId: string,
  ): Promise<Stripe.Customer> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      return this.stripe.customers.retrieve(
        user.stripeCustomerId,
      ) as Promise<Stripe.Customer>;
    }

    // Create new Stripe customer
    const customer = await this.stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
      },
    });

    // Update user with Stripe customer ID
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer;
  }
}
