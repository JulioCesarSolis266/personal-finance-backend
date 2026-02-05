import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { IncomeCategoryService } from './income-category.service';
import { CreateIncomeCategoryDto } from './dto/create-income-category.dto';
import { UpdateIncomeCategoryDto } from './dto/update-income-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtUser } from '../auth/types/jwt-user.type';

@Controller('income-category')
@UseGuards(AuthGuard('jwt'))
export class IncomeCategoryController {
  constructor(private readonly incomeCategoryService: IncomeCategoryService) {}

  @Post()
  create(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: CreateIncomeCategoryDto,
  ) {
    return this.incomeCategoryService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: Request & { user: JwtUser }) {
    return this.incomeCategoryService.findAll(req.user.id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: JwtUser },
    @Param('id') id: string,
    @Body() dto: UpdateIncomeCategoryDto,
  ) {
    return this.incomeCategoryService.update(req.user.id, String(id), dto);
  }

  @Delete(':id')
  remove(@Req() req: Request & { user: JwtUser }, @Param('id') id: string) {
    return this.incomeCategoryService.remove(req.user.id, String(id));
  }
}
