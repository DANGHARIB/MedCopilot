import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export enum PaymentMethodType {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
}

export enum CardBrand {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  DISCOVER = 'discover',
  DINERS = 'diners',
  JCB = 'jcb',
  UNKNOWN = 'unknown',
}

export class CreatePaymentMethodDto {
  @IsString()
  subscriptionId: string;

  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @IsString()
  last4: string;

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