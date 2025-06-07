import { IsOptional, IsString, IsEmail } from 'class-validator';

export class GetUserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
