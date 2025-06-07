// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../customGuards/roles.guard';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    JwtStrategy,
    RolesGuard, // optional if you're using global guards
  ],
})
export class UserModule {}
