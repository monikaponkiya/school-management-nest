import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { STUDENT_COUNT } from 'src/common/constants/response.constants';
import { FilterDto } from './dto/filter.dto';
import { AdminGuard } from 'src/guard/admin.guard';
import { statusOk } from 'src/common/constants/response.status.constant';

@Controller('dashboard')
@ApiTags('Dashboard Management')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Post('student-count')
  @ApiOperation({
    summary: 'Student count api',
  })
  @ResponseMessage(STUDENT_COUNT)
  @HttpCode(statusOk)
  async getDashboardCount(@Body() filter: FilterDto) {
    return await this.dashboardService.getDashboardCount(filter);
  }
}
