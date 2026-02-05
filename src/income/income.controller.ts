import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { DateRangeDto } from '../common/dto/date-range.dto';

@Controller('income')
@UseGuards(JwtAuthGuard)
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get('total')
  getTotal(@Request() req, @Query() query: DateRangeDto) {
    return this.incomeService.getTotal(req.user.id, query);
  }

  @Get()
  findAll(@Request() req) {
    return this.incomeService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.incomeService.findOne(req.user.id, id);
  }

  @Post()
  create(@Body() dto: CreateIncomeDto, @Request() req) {
    return this.incomeService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateIncomeDto,
    @Request() req,
  ) {
    return this.incomeService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.incomeService.remove(req.user.id, id);
  }
}
