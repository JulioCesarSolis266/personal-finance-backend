import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatsService } from './stats.service';
import { DateRangeDto } from '../common/dto/date-range.dto';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('monthly')
  getMonthlyTotals(@Request() req, @Query() query: DateRangeDto) {
    return this.statsService.getMonthlyTotals(req.user.id, query);
  }

  @Get('by-category')
  getByCategory(@Request() req, @Query() query: DateRangeDto) {
    return this.statsService.getTotalsByCategory(req.user.id, query);
  }

  @Get('dashboard')
  getDashboard(@Request() req, @Query() query: DateRangeDto) {
    return this.statsService.getDashboard(req.user.id, query);
  }

  @Get('balance')
  getBalance(@Request() req, @Query() query: DateRangeDto) {
    return this.statsService.getBalance(req.user.id, query);
  }
}
