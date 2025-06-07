import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum BillingStatus {
  PAID = 'paid',
  PENDING = 'pending',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export class CreateBillingRecordDto {
  @IsString()
  subscriptionId: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsEnum(BillingStatus)
  @IsOptional()
  status?: BillingStatus;

  @IsString()
  planName: string;

  // Stripe-specific fields
  @IsString()
  @IsOptional()
  stripeInvoiceId?: string;

  @IsString()
  @IsOptional()
  stripePaymentIntentId?: string;

  @IsString()
  @IsOptional()
  stripeChargeId?: string;
} 