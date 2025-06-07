/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, GetUserDto, DeleteUserDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../customGuards/roles.guard';
import { Roles } from '../customGuards/roles.decorator';
import { CurrentUser } from '../customGuards/current-user.decorator';

@Controller('api/medschool/external/user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser() user: any) {
    return this.userService.getUser({ id: user.sub });
  }

  @Patch('me')
  async updateSelf(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(user.sub, dto, user.sub, user.role);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  async deleteSelf(@CurrentUser() user: any) {
    return this.userService.deleteUser({ id: user.sub }, user.sub, user.role);
  }

  // --- ADMIN ROUTES ---
  @Get()
  @Roles('ADMIN')
  async listUsers() {
    return this.userService.listUsers();
  }

  @Get(':id')
  @Roles('ADMIN')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUser({ id });
  }

  @Patch(':id')
  @Roles('ADMIN')
  async updateUserAsAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.updateUser(id, dto, user.sub, user.role);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteUserAsAdmin(@Param('id') id: string, @CurrentUser() user: any) {
    return this.userService.deleteUser({ id }, user.sub, user.role);
  }
}
