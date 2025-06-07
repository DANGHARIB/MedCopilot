import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { GetSubscriptionDto } from './dto/get-subscription.dto';

@Injectable()
export class SubscriptionService {
  getAllSubscriptions() {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  async createSubscription(userId: string, dto: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        ...dto,
        userId,
        status: dto.status || 'active',
      },
      include: {
        paymentMethods: true,
        billingHistory: true,
      },
    });
  }

  async getSubscription(
    dto: GetSubscriptionDto,
    requesterId: string,
    requesterRole: string,
  ) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        OR: [{ id: dto.id }, { userId: dto.userId }],
      },
      include: {
        paymentMethods: true,
        billingHistory: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== requesterId && requesterRole !== 'ADMIN') {
      throw new ForbiddenException(
        'You are not allowed to view this subscription',
      );
    }

    return subscription;
  }

  async updateSubscription(
    id: string,
    dto: UpdateSubscriptionDto,
    requesterId: string,
    requesterRole: string,
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== requesterId && requesterRole !== 'ADMIN') {
      throw new ForbiddenException(
        'You are not allowed to update this subscription',
      );
    }

    return this.prisma.subscription.update({
      where: { id },
      data: dto,
      include: {
        paymentMethods: true,
        billingHistory: true,
      },
    });
  }

  async deleteSubscription(
    id: string,
    requesterId: string,
    requesterRole: string,
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== requesterId && requesterRole !== 'ADMIN') {
      throw new ForbiddenException(
        'You are not allowed to delete this subscription',
      );
    }

    return this.prisma.subscription.delete({
      where: { id },
    });
  }

  async getUserSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: {
        paymentMethods: true,
        billingHistory: true,
      },
    });
  }
}
