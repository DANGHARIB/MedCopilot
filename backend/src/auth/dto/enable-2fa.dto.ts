// src/auth/dto/enable-2fa.dto.ts
import { IsString } from 'class-validator';

export class Enable2FADto {
  @IsString()
  twoFactorCode: string;
  token: string;
}
