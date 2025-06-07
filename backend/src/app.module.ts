import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { BillingRecordModule } from './billing-record/billing-record.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    SubscriptionModule,
    PaymentMethodModule,
    BillingRecordModule,
  ],
  providers: [],
})
export class AppModule {}
