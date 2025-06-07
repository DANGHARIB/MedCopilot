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
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../customGuards/roles.guard';
// import { Roles } from '../customGuards/roles.decorator';
import { CurrentUser } from '../customGuards/current-user.decorator';

@Controller('api/medschool/external/payment-method')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  async createPaymentMethod(
    @CurrentUser() user: any,
    @Body() dto: CreatePaymentMethodDto,
  ) {
    return this.paymentMethodService.createPaymentMethod(user.userId, dto);
  }

  @Get('subscription/:subscriptionId')
  async getSubscriptionPaymentMethods(
    @Param('subscriptionId') subscriptionId: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentMethodService.getSubscriptionPaymentMethods(
      subscriptionId,
      user.userId,
    );
  }

  @Get(':id')
  async getPaymentMethod(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentMethodService.getPaymentMethod(
      { id },
      user.userId,
      user.role,
    );
  }

  @Patch(':id')
  async updatePaymentMethod(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentMethodDto,
    @CurrentUser() user: any,
  ) {
    return this.paymentMethodService.updatePaymentMethod(
      id,
      dto,
      user.userId,
      user.role,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deletePaymentMethod(@Param('id') id: string, @CurrentUser() user: any) {
    return this.paymentMethodService.deletePaymentMethod(
      id,
      user.userId,
      user.role,
    );
  }
}
