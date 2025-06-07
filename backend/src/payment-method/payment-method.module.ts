import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../customGuards/roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService, PrismaService, JwtStrategy, RolesGuard],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
