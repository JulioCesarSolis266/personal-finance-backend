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
    const category = await this.prisma.incomeCategory.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.prisma.incomeCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const result = await this.prisma.incomeCategory.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return { message: 'Eliminado correctamente' };
  }
}
