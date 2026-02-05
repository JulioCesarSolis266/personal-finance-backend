import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateRangeDto } from '../common/dto/date-range.dto';
import { groupBy } from 'lodash';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string, { from, to }: DateRangeDto) {
    const dateFilter =
      from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : {};

    const [income, expense] = await Promise.all([
      this.prisma.income.aggregate({
        where: { userId, ...dateFilter },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: { userId, ...dateFilter },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount ?? 0;
    const totalExpense = expense._sum.amount ?? 0;

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  async getMonthlyTotals(userId: string, { from, to }: DateRangeDto) {
    const dateFilter =
      from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : {};

    const [incomes, expenses] = await Promise.all([
      this.prisma.income.findMany({
        where: { userId, ...dateFilter },
        select: { amount: true, date: true },
      }),
      this.prisma.expense.findMany({
        where: { userId, ...dateFilter },
        select: { amount: true, date: true },
      }),
    ]);

    const map = new Map<string, { income: number; expense: number }>();

    const getKey = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    for (const i of incomes) {
      const key = getKey(i.date);
      if (!map.has(key)) {
        map.set(key, { income: 0, expense: 0 });
      }
      map.get(key)!.income += i.amount;
    }

    for (const e of expenses) {
      const key = getKey(e.date);
      if (!map.has(key)) {
        map.set(key, { income: 0, expense: 0 });
      }
      map.get(key)!.expense += e.amount;
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, totals]) => ({
        month,
        ...totals,
      }));
  }

  async getTotalsByCategory(userId: string, { from, to }: DateRangeDto) {
    const dateFilter =
      from && to ? { date: { gte: new Date(from), lte: new Date(to) } } : {};

    const income = await this.prisma.income.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    const expense = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        ...dateFilter,
      },
      _sum: {
        amount: true,
      },
    });

    // Resolver nombres de categorías
    const incomeCategories = await this.prisma.incomeCategory.findMany({
      where: {
        id: { in: income.map((i) => i.categoryId) },
      },
    });

    const expenseCategories = await this.prisma.expenseCategory.findMany({
      where: {
        id: { in: expense.map((e) => e.categoryId) },
      },
    });

    return {
      income: income.map((i) => ({
        categoryId: i.categoryId,
        category:
          incomeCategories.find((c) => c.id === i.categoryId)?.name ??
          'Sin categoría',
        total: i._sum.amount ?? 0,
      })),
      expense: expense.map((e) => ({
        categoryId: e.categoryId,
        category:
          expenseCategories.find((c) => c.id === e.categoryId)?.name ??
          'Sin categoría',
        total: e._sum.amount ?? 0,
      })),
    };
  }

  async getDashboard(userId: string, range: DateRangeDto) {
    const [balance, monthly, byCategory] = await Promise.all([
      this.getBalance(userId, range),
      this.getMonthlyTotals(userId, range),
      this.getTotalsByCategory(userId, range),
    ]);

    return {
      balance,
      monthly,
      byCategory,
    };
  }
}
