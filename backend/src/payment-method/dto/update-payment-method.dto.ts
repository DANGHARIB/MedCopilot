import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { PaymentMethodType, CardBrand } from './create-payment-method.dto';

export class UpdatePaymentMethodDto {
  @IsEnum(PaymentMethodType)
  @IsOptional()
  type?: PaymentMethodType;

  @IsString()
  @IsOptional()
  last4?: string;

  @IsEnum(CardBrand)
  @IsOptional()
  brand?: CardBrand;

  @IsString()
  @IsOptional()
  expiryMonth?: string;

  @IsString()
  @IsOptional()
  expiryYear?: string;

  @IsString()
  @IsOptional()
  cardHolder?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  // Stripe-specific fields
  @IsString()
  @IsOptional()
  stripePaymentMethodId?: string;

  @IsString()
  @IsOptional()
  stripeCustomerId?: string;
} 