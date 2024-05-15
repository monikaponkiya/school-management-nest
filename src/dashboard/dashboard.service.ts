import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { Student, StudentDocument } from 'src/student/schema/student.schema';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,
  ) {}

  async getDashboardCount(body: FilterDto) {
    try {
      const aggregateQuery = [];
      aggregateQuery.push({
        $match: {
          isDeleted: false,
        },
      });
      if (body.schoolId) {
        aggregateQuery.push({
          $match: {
            schoolId: new mongoose.Types.ObjectId(body.schoolId),
          },
        });
      }
      if (body.standard) {
        aggregateQuery.push({
          $match: {
            standard: Number(body.standard),
          },
        });
      }
      aggregateQuery.push({
        $count: 'count',
      });
      const studentCount = await this.studentModel.aggregate(aggregateQuery);
      return studentCount;
    } catch (error) {
      throw AuthExceptions.customException(
        error.message,
        error.statusCode ?? statusBadRequest,
      );
    }
  }
}
