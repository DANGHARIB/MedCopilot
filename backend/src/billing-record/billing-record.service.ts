import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';
import { UpdateBillingRecordDto } from './dto/update-billing-record.dto';
import { GetBillingRecordDto } from './dto/get-billing-record.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BillingRecordService {
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

  async createBillingRecord(userId: string, dto: CreateBillingRecordDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: dto.subscriptionId },
      include: {
        user: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to create billing records for this subscription',
      );
    }

    try {
      // If we have Stripe-related IDs, verify them
      if (dto.stripeInvoiceId) {
        const invoice = await this.stripe.invoices.retrieve(
          dto.stripeInvoiceId,
        );
        if (invoice.customer !== subscription.user.stripeCustomerId) {
          throw new BadRequestException('Invalid Stripe invoice ID');
        }
      }

      if (dto.stripePaymentIntentId) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(
          dto.stripePaymentIntentId,
        );
        if (paymentIntent.customer !== subscription.user.stripeCustomerId) {
          throw new BadRequestException('Invalid Stripe payment intent ID');
        }
      }

      return this.prisma.billingRecord.create({
        data: {
          ...dto,
          status: dto.status || 'pending',
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to create billing record: ${error.message}`,
      );
    }
  }

  async getBillingRecord(
    dto: GetBillingRecordDto,
    userId: string,
    requesterRole: string,
  ) {
    const billingRecord = await this.prisma.billingRecord.findFirst({
      where: {
        OR: [{ id: dto.id }, { subscriptionId: dto.subscriptionId }],
      },
      include: {
        subscription: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!billingRecord) {
      throw new NotFoundException('Billing record not found');
    }

    if (
      billingRecord.subscription.userId !== userId &&
      requesterRole !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You are not allowed to view this billing record',
      );
    }

    return billingRecord;
  }

  async updateBillingRecord(
    id: string,
    dto: UpdateBillingRecordDto,
    userId: string,
    requesterRole: string,
  ) {
    const billingRecord = await this.prisma.billingRecord.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!billingRecord) {
      throw new NotFoundException('Billing record not found');
    }

    if (
      billingRecord.subscription.userId !== userId &&
      requesterRole !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this billing record',
      );
    }

    try {
      // If we're updating Stripe-related fields, verify them
      if (dto.stripeInvoiceId) {
        const invoice = await this.stripe.invoices.retrieve(
          dto.stripeInvoiceId,
        );
        if (invoice.customer !== billingRecord.subscription.user.stripeCustomerId) {
          throw new BadRequestException('Invalid Stripe invoice ID');
        }
      }

      if (dto.stripePaymentIntentId) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(
          dto.stripePaymentIntentId,
        );
        if (
          paymentIntent.customer !== billingRecord.subscription.user.stripeCustomerId
        ) {
          throw new BadRequestException('Invalid Stripe payment intent ID');
        }
      }

      return this.prisma.billingRecord.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException(
        `Failed to update billing record: ${error.message}`,
      );
    }
  }

  async deleteBillingRecord(id: string, userId: string, requesterRole: string) {
    const billingRecord = await this.prisma.billingRecord.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!billingRecord) {
      throw new NotFoundException('Billing record not found');
    }

    if (
      billingRecord.subscription.userId !== userId &&
      requesterRole !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this billing record',
      );
    }

    return this.prisma.billingRecord.delete({
      where: { id },
    });
  }

  async getSubscriptionBillingRecords(subscriptionId: string, userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to view these billing records',
      );
    }

    return this.prisma.billingRecord.findMany({
      where: { subscriptionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllBillingRecords() {
    return this.prisma.billingRecord.findMany({
      include: {
        subscription: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
