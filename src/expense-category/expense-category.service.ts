import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';

@Injectable()
export class ExpenseCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseCategoryDto) {
    const exists = await this.prisma.expenseCategory.findFirst({
      where: {
        name: dto.name,
        userId,
      },
    });

    if (exists) {
      throw new ConflictException('La categoría ya existe');
    }

    return this.prisma.expenseCategory.create({
      data: {
        name: dto.name,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.expenseCategory.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async update(userId: string, id: string, dto: UpdateExpenseCategoryDto) {
    const category = await this.prisma.expenseCategory.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.prisma.expenseCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    const result = await this.prisma.expenseCategory.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return { message: 'Eliminado correctamente' };
  }
}
