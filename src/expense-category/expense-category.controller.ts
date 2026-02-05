import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseCategoryService } from './expense-category.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { JwtUser } from '../auth/types/jwt-user.type';

@Controller('expense-category')
@UseGuards(AuthGuard('jwt'))
export class ExpenseCategoryController {
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
  ) {}

  @Post()
  create(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: CreateExpenseCategoryDto,
  ) {
    return this.expenseCategoryService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: Request & { user: JwtUser }) {
    return this.expenseCategoryService.findAll(req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: JwtUser },
    @Param('id') id: string,
    @Body() dto: UpdateExpenseCategoryDto,
  ) {
    return this.expenseCategoryService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.expenseCategoryService.remove(req.user.id, id);
  }
}
