import { IsString, IsOptional } from 'class-validator';

export class GetBillingRecordDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  subscriptionId?: string;
} 