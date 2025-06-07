// src/user/dto/update-user.dto.ts
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsDateString()
  deletedAt?: Date;

  @IsOptional()
  @IsDateString()
  lastLoginAt?: Date;

  @IsOptional()
  @IsString()
  lastLoginIP?: string;
}
