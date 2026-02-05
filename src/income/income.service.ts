import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { DateRangeDto } from '../common/dto/date-range.dto';

@Injectable()
export class IncomeService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateIncomeDto) {
    // 1. Verificar que la categoría pertenezca al usuario
    const category = await this.prisma.incomeCategory.findFirst({
      where: {
        id: dto.categoryId,
        userId,
      },
    });

    if (!category) {
      throw new ForbiddenException('La categoría no pertenece al usuario');
    }

    // 2. Crear el income
    return this.prisma.income.create({
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
    return this.prisma.income.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: {
        category: true,
      },
    });
  }

  async findOne(userId: string, id: string) {
    const income = await this.prisma.income.findFirst({
      where: { id, userId },
    });

    if (!income) {
      throw new NotFoundException('Ingreso no encontrado');
    }

    return income;
  }

  async update(userId: string, incomeId: string, dto: UpdateIncomeDto) {
    const income = await this.prisma.income.findFirst({
      where: {
        id: incomeId,
        userId,
      },
    });

    if (!income) {
      throw new ForbiddenException('Ingreso no encontrado');
    }

    return this.prisma.income.update({
      where: { id: incomeId },
      data: {
        amount: dto.amount,
        date: dto.date ? new Date(dto.date) : undefined,
        description: dto.description,
        categoryId: dto.categoryId,
      },
    });
  }

  async remove(userId: string, id: string) {
    const result = await this.prisma.income.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Ingreso no encontrado');
    }

    return { message: 'Eliminado correctamente' };
  }

  // Obtener el total de ingresos por periodo de  fechas

  async getTotal(userId: string, query: DateRangeDto) {
    const where: any = { userId };

    if (query.from || query.to) {
      where.date = {};
      if (query.from) where.date.gte = new Date(query.from);
      if (query.to) where.date.lte = new Date(query.to);
    }

    const result = await this.prisma.income.aggregate({
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
