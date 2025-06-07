import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignupDto,
  SigninDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  // VerifyPhoneDto,
  Enable2FADto,
  OAuthLoginDto,
  RefreshTokenDto,
} from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { Request } from 'express';
import { CurrentUser } from 'src/customGuards/current-user.decorator';

@Controller('api/medschool/external/user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: SigninDto, @Req() req: Request) {
    let ip =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (Array.isArray(ip)) {
      ip = ip[0];
    }
    const userAgent = req.headers['user-agent'] || 'Unknown';

    return this.authService.signin(dto, ip, userAgent);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  // src/auth/auth.controller.ts
  @Post('resend-verification-email')
  @HttpCode(HttpStatus.OK)
  async resendVerificationEmail(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  // @Post('verify-phone')
  // @HttpCode(HttpStatus.OK)
  // async verifyPhone(@Body() dto: VerifyPhoneDto) {
  //   return this.authService.verifyPhone(dto);
  // }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@CurrentUser() user, @Body() dto: Enable2FADto) {
    // req.user contains the user payload from the JWT guard
    return this.authService.enable2FA(user.sub, dto);
  }

  @Post('oauth-login')
  @HttpCode(HttpStatus.OK)
  async oauthLogin(@Body() dto: OAuthLoginDto) {
    return this.authService.oauthLogin(dto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user, @Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    const ip =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    await this.authService.logout(token, ip as string, userAgent);
    return { message: 'Logged out successfully' };
  }
}
