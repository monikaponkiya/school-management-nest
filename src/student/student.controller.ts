import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import {
  CREATE_STUDENT,
  DELETE_STUDENT,
  GET_STUDENT,
  STUDENT_ACTIVE_INACTIVE,
  STUDENT_LIST,
  UPDATE_STUDENT,
} from 'src/common/constants/response.constants';
import { ListStudentDto } from './dto/list-student.dto';
import { SchoolGuard } from 'src/guard/school.guard';
import { CreateUpdateStudentDto } from './dto/create-update-student.dto';

@Controller('student')
@ApiTags('Student Management')
@ApiBearerAuth()
@UseGuards(SchoolGuard)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post('create-student')
  @ApiOperation({
    summary: 'create student api',
  })
  @ResponseMessage(CREATE_STUDENT)
  async createStudent(@Body() body: CreateUpdateStudentDto) {
    return await this.studentService.createStudent(body);
  }

  @Put('update-student/:studentId')
  @ApiOperation({
    summary: 'Update student api',
  })
  @ResponseMessage(UPDATE_STUDENT)
  async updateStudent(
    @Body() body: CreateUpdateStudentDto,
    @Param('studentId') studentId: string,
  ) {
    return await this.studentService.updateStudent(body, studentId);
  }

  @Post('student-list')
  @ApiOperation({
    summary: 'Student list api',
  })
  @ResponseMessage(STUDENT_LIST)
  async getStudentList(@Body() body: ListStudentDto) {
    return await this.studentService.getStudentList(body);
  }

  @Get('student-detail/:studentId')
  @ApiOperation({
    summary: 'Get student detail api',
  })
  @ResponseMessage(GET_STUDENT)
  async getStudentDetail(@Param('studentId') studentId: string) {
    return await this.studentService.getStudentDetailById(studentId);
  }

  @Put('active-inactive-student/:studentId/:isActive')
  @ApiOperation({
    summary: 'Active inactive student api',
  })
  @ResponseMessage(STUDENT_ACTIVE_INACTIVE)
  async activeInactiveStudent(
    @Param('studentId') studentId: string,
    @Param('isActive') isActive: boolean,
  ) {
    return await this.studentService.activeInactiveStudent(studentId, isActive);
  }

  @Delete('delete-student/:studentId')
  @ApiOperation({
    summary: 'Delete student api',
  })
  @ResponseMessage(DELETE_STUDENT)
  async deleteStudent(@Param('studentId') studentId: string) {
    return await this.studentService.deleteStudent(studentId);
  }
}
