import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(dto: GetUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        ...(dto.id && { id: dto.id }),
        ...(dto.email && { email: dto.email }),
        isDeleted: false,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
    requesterId: string,
    requesterRole: string,
  ) {
    if (requesterId !== userId && requesterRole !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to update this user');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.isDeleted) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });
  }

  async deleteUser(
    dto: DeleteUserDto,
    requesterId: string,
    requesterRole: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.id } });
    if (!user || user.isDeleted) throw new NotFoundException('User not found');

    if (requesterId !== dto.id && requesterRole !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this user');
    }

    return this.prisma.user.update({
      where: { id: dto.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async listUsers() {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }
}
