import { Module } from '@nestjs/common';
import { BillingRecordService } from './billing-record.service';
import { BillingRecordController } from './billing-record.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../customGuards/roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [BillingRecordController],
  providers: [BillingRecordService, PrismaService, JwtStrategy, RolesGuard],
  exports: [BillingRecordService],
})
export class BillingRecordModule {}
