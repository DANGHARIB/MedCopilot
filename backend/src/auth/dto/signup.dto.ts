// src/auth/dto/signup.dto.ts
import { IsEmail, MinLength, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
