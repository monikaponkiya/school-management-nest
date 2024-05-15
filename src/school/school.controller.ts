import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import {
  CREATE_SCHOOL,
  GET_SCHOOL,
  SCHOOL_LIST,
  UPDATE_SCHOOL,
} from 'src/common/constants/response.constants';
import { ListDto } from 'src/common/dto/list.dto';
import { AdminGuard } from 'src/guard/admin.guard';
import { CreateUpdateSchoolDto } from './dto/create-school.dto';

@Controller('school')
@ApiTags('School Management')
@ApiBearerAuth()
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @UseGuards(AdminGuard)
  @Post('/create-school')
  @ApiOperation({
    summary: 'create school api',
  })
  @ResponseMessage(CREATE_SCHOOL)
  async createSchool(@Body() body: CreateUpdateSchoolDto) {
    return await this.schoolService.createSchool(body);
  }

  @Put('/update-school/:schoolId')
  @ApiOperation({
    summary: 'update school api',
  })
  @ResponseMessage(UPDATE_SCHOOL)
  async updateSchool(
    @Body() body: CreateUpdateSchoolDto,
    @Param('schoolId') schoolId: string,
  ) {
    return await this.schoolService.updateSchoolDetails(body, schoolId);
  }

  @UseGuards(AdminGuard)
  @Post('school-list')
  @ApiOperation({
    summary: 'school list api',
  })
  @ResponseMessage(SCHOOL_LIST)
  async schoolList(@Body() body: ListDto) {
    return await this.schoolService.getSchoolList(body);
  }

  @Get('school-details/:schoolId')
  @ResponseMessage(GET_SCHOOL)
  async getSchoolDetails(@Param('schoolId') schoolId: string) {
    return await this.schoolService.getSchoolDetails(schoolId);
  }
}
