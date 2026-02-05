import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { DateRangeDto } from '../common/dto/date-range.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    const category = await this.prisma.expenseCategory.findFirst({
      where: {
        id: dto.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new ForbiddenException('La categoría no pertenece al usuario');
    }

    //Crear el expense
    return this.prisma.expense.create({
      data: {
        amount: dto.amount,
        date: new Date(dto.date),
        description: dto.description,
        userId,
        categoryId: dto.categoryId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: { category: true },
    });
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, userId },
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        amount: dto.amount,
        date: dto.date ? new Date(dto.date) : undefined,
        description: dto.description,
        categoryId: dto.categoryId,
      },
    });
  }

  async remove(userId: string, id: string) {
    const result = await this.prisma.expense.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Gasto no encontrado');
    }

    return { message: 'Eliminado correctamente' };
  }

  async getTotal(userId: string, query: DateRangeDto) {
    const where: any = { userId };

    if (query.from || query.to) {
      where.date = {};
      if (query.from) where.date.gte = new Date(query.from);
      if (query.to) where.date.lte = new Date(query.to);
    }

    const result = await this.prisma.expense.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    return {
      total: result._sum.amount ?? 0,
    };
  }
}
