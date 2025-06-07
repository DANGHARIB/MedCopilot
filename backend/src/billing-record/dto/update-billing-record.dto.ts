import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { BillingStatus } from './create-billing-record.dto';

export class UpdateBillingRecordDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(BillingStatus)
  @IsOptional()
  status?: BillingStatus;

  @IsString()
  @IsOptional()
  planName?: string;

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