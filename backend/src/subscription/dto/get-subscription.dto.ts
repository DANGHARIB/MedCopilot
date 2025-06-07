import { IsString, IsOptional } from 'class-validator';

export class GetSubscriptionDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  userId?: string;
} 