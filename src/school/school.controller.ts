import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import {
  CREATE_SCHOOL,
  GET_SCHOOL,
  SCHOOL_LIST,
  SCHOOL_LOGIN,
  UPDATE_SCHOOL,
} from 'src/common/constants/response.constants';
import { CreateSchoolDto } from './dto/create-school.dto';
import { AuthService } from 'src/security/auth/auth.service';
import { Public } from 'src/security/auth/auth.decorator';
import { LoginDto } from 'src/common/dto/login.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { ListDto } from 'src/common/dto/list.dto';

@Controller('school')
@ApiTags('School Management')
export class SchoolController {
  constructor(
    private schoolService: SchoolService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('/school-login')
  @ApiOperation({
    summary: 'School login',
  })
  @ResponseMessage(SCHOOL_LOGIN)
  async schoolLogin(@Body() body: LoginDto) {
    return await this.authService.schoolLogin(body);
  }

  @ApiBearerAuth()
  @Post('/create-school')
  @ApiOperation({
    summary: 'create school api',
  })
  @ResponseMessage(CREATE_SCHOOL)
  async createSchool(@Body() body: CreateSchoolDto) {
    return await this.schoolService.createSchool(body);
  }

  @ApiBearerAuth()
  @Put('/update-school/:schoolId')
  @ApiOperation({
    summary: 'update school api',
  })
  @ResponseMessage(UPDATE_SCHOOL)
  async updateSchool(
    @Body() body: UpdateSchoolDto,
    @Param('schoolId') schoolId: string,
  ) {
    return await this.schoolService.updateSchoolDetails(body, schoolId);
  }

  @ApiBearerAuth()
  @Post('school-list')
  @ApiOperation({
    summary: 'school list api',
  })
  @ResponseMessage(SCHOOL_LIST)
  async schoolList(@Body() body: ListDto) {
    return await this.schoolService.getSchoolList(body);
  }

  @ApiBearerAuth()
  @Get('school-details/:schoolId')
  @ResponseMessage(GET_SCHOOL)
  async getSchoolDetails(@Param('schoolId') schoolId: string) {
    return await this.schoolService.getSchoolDetails(schoolId);
  }
}
