import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { HealthModule } from './health/health.module';
import { IncomeController } from './income/income.controller';
import { IncomeModule } from './income/income.module';
import { IncomeService } from './income/income.service';
import { IncomeCategoryModule } from './income-category/income-category.module';
import { ExpenseModule } from './expense/expense.module';
import { ExpenseCategoryModule } from './expense-category/expense-category.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    IncomeCategoryModule,
    IncomeModule,
    HealthModule,
    IncomeModule,
    IncomeCategoryModule,
    ExpenseModule,
    ExpenseCategoryModule,
    StatsModule,
  ],
  controllers: [AppController, IncomeController],
  providers: [AppService, PrismaService, IncomeService],
})
export class AppModule {}
