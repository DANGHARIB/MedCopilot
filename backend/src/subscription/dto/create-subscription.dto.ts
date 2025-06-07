import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export enum BillingInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export class CreateSubscriptionDto {
  @IsString()
  planId: string;

  @IsEnum(BillingInterval)
  billingInterval: BillingInterval;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsDateString()
  @IsOptional()
  nextBillingDate?: Date;

  @IsNumber()
  amount: number;
}
