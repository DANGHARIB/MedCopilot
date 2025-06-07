// src/auth/dto/oauth-login.dto.ts
import { IsString } from 'class-validator';

export class OAuthLoginDto {
  @IsString()
  provider: string;

  @IsString()
  providerId: string;

  @IsString()
  email: string;
}
