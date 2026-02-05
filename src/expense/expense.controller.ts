import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtUser } from '../auth/types/jwt-user.type';
import { DateRangeDto } from '../common/dto/date-range.dto';

@Controller('expense')
@UseGuards(AuthGuard('jwt'))
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('total')
  getTotal(@Request() req, @Query() query: DateRangeDto) {
    return this.expenseService.getTotal(req.user.id, query);
  }

  @Post()
  create(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expenseService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: Request & { user: JwtUser }) {
    return this.expenseService.findAll(req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: JwtUser },
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.expenseService.remove(req.user.id, id);
  }
}
