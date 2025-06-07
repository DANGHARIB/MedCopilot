import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../customGuards/roles.guard';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService, JwtStrategy, RolesGuard],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
