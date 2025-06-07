import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { BillingInterval, SubscriptionStatus } from './create-subscription.dto';

export class UpdateSubscriptionDto {
  @IsString()
  @IsOptional()
  planId?: string;

  @IsEnum(BillingInterval)
  @IsOptional()
  billingInterval?: BillingInterval;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsDateString()
  @IsOptional()
  nextBillingDate?: Date;

  @IsNumber()
  @IsOptional()
  amount?: number;
}
