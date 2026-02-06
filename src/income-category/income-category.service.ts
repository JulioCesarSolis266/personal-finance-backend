import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeCategoryDto } from './dto/create-income-category.dto';
import { UpdateIncomeCategoryDto } from './dto/update-income-category.dto';

@Injectable()
export class IncomeCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateIncomeCategoryDto) {
    try {
      return await this.prisma.incomeCategory.create({
        data: {
          name: dto.name,
          userId,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('La categoría ya existe');
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    return this.prisma.incomeCategory.findMany({
      where: { userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateIncomeCategoryDto) {
    const updated = await this.prisma.incomeCategory.updateMany({
      where: { id, userId },
      data: dto,
    });

    if (updated.count === 0) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return {
      message: 'Categoría actualizada correctamente',
    };
  }
}
