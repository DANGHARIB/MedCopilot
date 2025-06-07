import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../customGuards/roles.guard';
import { Roles } from '../customGuards/roles.decorator';
import { CurrentUser } from '../customGuards/current-user.decorator';

@Controller('api/medschool/external/subscription')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(
    @CurrentUser() user: any,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.createSubscription(user.userId, dto);
  }

  @Get('me')
  async getMySubscriptions(@CurrentUser() user: any) {
    return this.subscriptionService.getUserSubscriptions(user.userId);
  }

  @Get(':id')
  async getSubscription(@Param('id') id: string, @CurrentUser() user: any) {
    return this.subscriptionService.getSubscription(
      { id },
      user.userId,
      user.role,
    );
  }

  @Patch(':id')
  async updateSubscription(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
    @CurrentUser() user: any,
  ) {
    return this.subscriptionService.updateSubscription(
      id,
      dto,
      user.userId,
      user.role,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSubscription(@Param('id') id: string, @CurrentUser() user: any) {
    return this.subscriptionService.deleteSubscription(
      id,
      user.userId,
      user.role,
    );
  }

  // Admin routes
  @Get()
  @Roles('ADMIN')
  async getAllSubscriptions() {
    return this.subscriptionService.getAllSubscriptions();
  }

  @Get('user/:userId')
  @Roles('ADMIN')
  async getUserSubscriptions(@Param('userId') userId: string) {
    return this.subscriptionService.getUserSubscriptions(userId);
  }
}
