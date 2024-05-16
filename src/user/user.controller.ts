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
import { UserService } from './user.service';
import { AdminGuard } from 'src/guard/admin.guard';
import {
  CREATE_SCHOOL,
  UPDATE_SCHOOL,
  SCHOOL_LIST,
  GET_SCHOOL,
} from 'src/common/constants/response.constants';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { ListDto } from 'src/common/dto/list.dto';
import { CreateUpdateUserDto } from './dto/create-user.dto';

@Controller('school')
@ApiTags('School Management')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AdminGuard)
  @Post('/create-school')
  @ApiOperation({
    summary: 'create school api',
  })
  @ResponseMessage(CREATE_SCHOOL)
  async createSchool(@Body() body: CreateUpdateUserDto) {
    return await this.userService.createSchool(body);
  }

  @Put('/update-school/:schoolId')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'update school api',
  })
  @ResponseMessage(UPDATE_SCHOOL)
  async updateSchool(
    @Body() body: CreateUpdateUserDto,
    @Param('schoolId') schoolId: string,
  ) {
    return await this.userService.updateSchool(body, schoolId);
  }

  @UseGuards(AdminGuard)
  @Post('school-list')
  @ApiOperation({
    summary: 'school list api',
  })
  @ResponseMessage(SCHOOL_LIST)
  async schoolList(@Body() body: ListDto) {
    return await this.userService.schoolList(body);
  }

  @Get('school-details/:schoolId')
  @ResponseMessage(GET_SCHOOL)
  async getSchoolDetails(@Param('schoolId') schoolId: string) {
    return await this.userService.getSchoolDetails(schoolId);
  }
}
