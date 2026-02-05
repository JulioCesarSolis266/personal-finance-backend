import { Module } from '@nestjs/common';
import { IncomeCategoryService } from './income-category.service';
import { IncomeCategoryController } from './income-category.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [IncomeCategoryController],
  providers: [IncomeCategoryService],
})
export class IncomeCategoryModule {}
