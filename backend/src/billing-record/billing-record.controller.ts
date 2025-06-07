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
import { BillingRecordService } from './billing-record.service';
import { CreateBillingRecordDto, UpdateBillingRecordDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../customGuards/roles.guard';
import { Roles } from '../customGuards/roles.decorator';
import { CurrentUser } from '../customGuards/current-user.decorator';

@Controller('api/medschool/external/billing-record')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingRecordController {
  constructor(private readonly billingRecordService: BillingRecordService) {}

  @Post()
  async createBillingRecord(
    @CurrentUser() user: any,
    @Body() dto: CreateBillingRecordDto,
  ) {
    return this.billingRecordService.createBillingRecord(user.userId, dto);
  }

  @Get('subscription/:subscriptionId')
  async getSubscriptionBillingRecords(
    @Param('subscriptionId') subscriptionId: string,
    @CurrentUser() user: any,
  ) {
    return this.billingRecordService.getSubscriptionBillingRecords(
      subscriptionId,
      user.userId,
    );
  }

  @Get(':id')
  async getBillingRecord(@Param('id') id: string, @CurrentUser() user: any) {
    return this.billingRecordService.getBillingRecord(
      { id },
      user.userId,
      user.role,
    );
  }

  @Patch(':id')
  async updateBillingRecord(
    @Param('id') id: string,
    @Body() dto: UpdateBillingRecordDto,
    @CurrentUser() user: any,
  ) {
    return this.billingRecordService.updateBillingRecord(
      id,
      dto,
      user.userId,
      user.role,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBillingRecord(@Param('id') id: string, @CurrentUser() user: any) {
    return this.billingRecordService.deleteBillingRecord(
      id,
      user.userId,
      user.role,
    );
  }

  // Admin routes
  @Get()
  @Roles('ADMIN')
  async getAllBillingRecords() {
    return this.billingRecordService.getAllBillingRecords();
  }
}
