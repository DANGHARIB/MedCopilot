import { IsString, IsOptional } from 'class-validator';

export class GetPaymentMethodDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  subscriptionId?: string;
} 