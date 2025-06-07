import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as speakeasy from 'speakeasy';
import * as nodemailer from 'nodemailer';

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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 12;
  private transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_HOST,
      auth: {
        user: process.env.MAIL_MAILER,
        pass: process.env.MAILER_PASSWORD,
      },
    });
  }

  // --- SIGNUP ---
  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const emailVerificationToken = randomBytes(32).toString('hex');
    const emailVerificationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        phoneNumber: dto.phoneNumber,
        emailVerificationToken,
        emailVerificationExpiresAt,
        role: 'USER',
      },
    });

    await this.sendVerificationEmail(user.email, emailVerificationToken);

    return {
      message: 'Signup successful, please verify your email',
      userId: user.id,
    };
  }

  async signin(dto: SigninDto, ip?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || user.isDeleted)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified)
      throw new ForbiddenException('Email not verified');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // --- CLEAN EXPIRED SESSIONS ---
    await this.prisma.session.deleteMany({
      where: {
        userId: user.id,
        expiresAt: { lt: new Date() },
      },
    });

    // --- ENFORCE SESSION LIMIT ---
    const maxSessions = 5;
    const sessions = await this.prisma.session.findMany({
      where: { userId: user.id },
    });

    if (sessions.length >= maxSessions) {
      throw new ForbiddenException(
        'Maximum device login limit reached. Please log out from another device to continue.',
      );
    }

    // --- GENERATE TOKENS ---
    const tokens = await this.generateTokens(user, ip, userAgent);

    return {
      message: 'Signin successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      tokens,
    };
  }

  // --- FORGOT PASSWORD ---
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || user.isDeleted) {
      // Always respond success to prevent user enumeration
      return {
        message:
          'If an account with this email exists, a reset link will be sent.',
      };
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpiresAt: expiresAt,
      },
    });

    await this.sendPasswordResetEmail(user.email, token);

    return { message: 'Password reset email sent if account exists' };
  }

  // --- RESET PASSWORD ---
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpiresAt: { gt: new Date() },
        isDeleted: false,
      },
    });
    if (!user) throw new BadRequestException('Invalid or expired reset token');

    const passwordHash = await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  // --- VERIFY EMAIL ---
  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: dto.token,
        emailVerificationExpiresAt: { gt: new Date() },
        isDeleted: false,
      },
    });
    if (!user)
      throw new BadRequestException(
        'Invalid or expired email verification token',
      );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  // --- RESEND VERIFICATION EMAIL ---
  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.isDeleted) {
      throw new BadRequestException('User not found or has been deleted');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const emailVerificationToken = crypto.randomUUID();
    const emailVerificationExpiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpiresAt,
      },
    });

    await this.sendVerificationEmail(user.email, emailVerificationToken);

    return { message: 'Verification email resent successfully' };
  }

  // --- VERIFY PHONE ---
  // async verifyPhone(dto: VerifyPhoneDto) {
  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       phoneVerificationToken: dto.token,
  //       phoneVerificationExpiresAt: { gt: new Date() },
  //       isDeleted: false,
  //     },
  //   });
  //   if (!user)
  //     throw new BadRequestException(
  //       'Invalid or expired phone verification token',
  //     );

  //   await this.prisma.user.update({
  //     where: { id: user.id },
  //     data: {
  //       isPhoneVerified: true,
  //       phoneVerificationToken: null,
  //       phoneVerificationExpiresAt: null,
  //     },
  //   });

  //   return { message: 'Phone verified successfully' };
  // }

  // --- ENABLE 2FA ---
  async enable2FA(userId: number, dto: Enable2FADto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId.toString() },
    });
    if (!user) throw new NotFoundException('User not found');

    // Verify provided TOTP token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: dto.token,
      window: 1,
    });
    if (!verified) throw new BadRequestException('Invalid 2FA token');

    await this.prisma.user.update({
      where: { id: userId.toString() },
      data: {
        twoFactorEnabled: true,
      },
    });

    return { message: 'Two-factor authentication enabled' };
  }

  // --- OAUTH LOGIN ---
  async oauthLogin(dto: OAuthLoginDto, ipAddress?: string, userAgent?: string) {
    let user = await this.prisma.user.findFirst({
      where: { provider: dto.provider, providerId: dto.providerId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash: '',
          isEmailVerified: true,
          provider: dto.provider,
          providerId: dto.providerId,
          role: 'USER',
        },
      });
    }

    const tokens = await this.generateTokens(user, ipAddress, userAgent);

    return {
      message: 'OAuth login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  // --- REFRESH TOKEN ---
  async refreshToken(dto: RefreshTokenDto) {
    if (!dto.refreshToken)
      throw new UnauthorizedException('No refresh token provided');

    const user = await this.prisma.user.findFirst({
      where: { refreshToken: dto.refreshToken, isDeleted: false },
    });

    if (!user) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.generateTokens(user);

    return tokens;
  }

  // --- LOGOUT ---
  async logout(jwtToken: string, ipAddress: string, userAgent: string) {
    if (!jwtToken) {
      throw new UnauthorizedException('Missing JWT token for logout');
    }

    const session = await this.prisma.session.findFirst({
      where: {
        jwtToken,
        ipAddress,
        userAgent,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    await this.prisma.session.delete({
      where: { id: session.id },
    });
  }

  // --- HELPERS ---

  private async generateTokens(user, ipAddress?: string, userAgent?: string) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    const decoded: any = this.jwtService.decode(accessToken);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        jwtToken: accessToken,
        ipAddress,
        userAgent,
        expiresAt: new Date(decoded.exp * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  private async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/api/medschool/external/user/auth/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify your email',
      html: `
        <p>Please verify your email by clicking the link below:</p>
        <a href="${url}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
    }
  }

  private async sendPasswordResetEmail(email: string, token: string) {
    const url = `http://localhost:3000/api/medschool/external/user/auth/reset-password?${token}`;
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${url}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error,
      );
    }
  }
}
