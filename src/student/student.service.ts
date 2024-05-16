import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { Student, StudentDocument } from './schema/student.schema';
import { ListStudentDto } from './dto/list-student.dto';
import { CreateUpdateStudentDto } from './dto/create-update-student.dto';
import { STUDENT_NOT_EXIST } from 'src/common/constants/response.constants';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,
  ) {}

  async createStudent(body: CreateUpdateStudentDto) {
    try {
      const studentObj = {
        ...body,
        schoolId: new mongoose.Types.ObjectId(body.schoolId),
      };
      return await this.studentModel.create(studentObj);
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async updateStudent(body: CreateUpdateStudentDto, studentId: string) {
    try {
      const isStudentExist = await this.studentModel.findOne({
        _id: studentId,
      });
      if (!isStudentExist) {
        throw AuthExceptions.customException(
          STUDENT_NOT_EXIST,
          statusBadRequest,
        );
      }
      return this.studentModel.findOneAndUpdate(
        {
          _id: studentId,
        },
        { $set: body },
        {
          new: true,
          runValidators: true,
        },
      );
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async getStudentList(body: ListStudentDto) {
    try {
      const page = body.page ? Number(body.page) : 1;
      const limit = body.limit ? Number(body.limit) : 10;
      const skip = (page - 1) * limit;
      const aggregateQuery = [];
      if (body.search) {
        const regex = new RegExp(body.search.trim(), 'i');
        const or = [
          {
            standard: regex,
          },
          {
            name: regex,
          },
        ];
        aggregateQuery.push({
          $match: {
            $or: or,
          },
        });
      }
      if (body.schoolId) {
        aggregateQuery.push({
          $match: {
            schoolId: new mongoose.Types.ObjectId(body.schoolId),
          },
        });
      }
      const and = [
        {
          isActive: true,
        },
        {
          isDeleted: false,
        },
      ];
      aggregateQuery.push(
        {
          $match: {
            $and: and,
          },
        },
        {
          $lookup: {
            from: 'schools',
            localField: 'schoolId',
            foreignField: '_id',
            as: 'schoolDetail',
          },
        },
        {
          $unwind: {
            path: '$schoolDetail',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            name: {
              $first: '$name',
            },
            parentPhoneNumber: {
              $first: '$parentPhoneNumber',
            },
            standard: {
              $first: '$standard',
            },
            address: {
              $first: '$address',
            },
            photo: {
              $first: '$photo',
            },
            DOB: {
              $first: '$DOB',
            },
            schoolDetail: {
              $first: '$schoolDetail',
            },
          },
        },
        {
          $project: {
            'schoolDetail.password': 0,
          },
        },
      );
      let sortOrder = -1;
      if (body.sortOrder) {
        sortOrder = body.sortOrder === 'asc' ? 1 : -1;
      }
      aggregateQuery.push({
        $sort: { [body.sortBy ? `${body.sortBy}` : 'createdAt']: sortOrder },
      });
      aggregateQuery.push({
        $facet: {
          studentList: [{ $skip: skip }, { $limit: limit }],
          total_records: [{ $count: 'count' }],
        },
      });
      let studentList = await this.studentModel.aggregate(aggregateQuery);
      if (studentList && !studentList[0]) {
        studentList = [
          {
            data: [],
          },
        ];
      }
      return studentList[0];
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async getStudentDetail(studentId: string) {
    try {
      const isStudentExist = await this.studentModel.findOne(
        {
          _id: studentId,
        },
        { isDeleted: false },
      );
      if (!isStudentExist) {
        throw AuthExceptions.customException(
          STUDENT_NOT_EXIST,
          statusBadRequest,
        );
      }
      const aggregateQuery = [];
      aggregateQuery.push(
        {
          $match: {
            _id: new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $lookup: {
            from: 'schools',
            localField: 'schoolId',
            foreignField: '_id',
            as: 'schoolDetail',
          },
        },
        {
          $unwind: {
            path: '$schoolDetail',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            name: {
              $first: '$name',
            },
            parentPhoneNumber: {
              $first: '$parentPhoneNumber',
            },
            standard: {
              $first: '$standard',
            },
            address: {
              $first: '$address',
            },
            photo: {
              $first: '$photo',
            },
            DOB: {
              $first: '$DOB',
            },
            schoolDetail: {
              $first: '$schoolDetail',
            },
          },
        },
        {
          $project: {
            'schoolDetail.password': 0,
          },
        },
      );
      return await this.studentModel.aggregate(aggregateQuery);
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async activeInactiveStudent(studentId: string, isActive: boolean) {
    try {
      const isStudentExist = await this.studentModel.findOne(
        {
          _id: studentId,
        },
        { isDeleted: false },
      );
      if (!isStudentExist) {
        throw AuthExceptions.customException(
          "Student doesn't exist",
          statusBadRequest,
        );
      }
      return await this.studentModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(studentId),
        },
        {
          isActive: isActive,
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async deleteStudent(studentId: string) {
    try {
      const isStudentExist = await this.studentModel.findOne({
        _id: studentId,
      });
      if (!isStudentExist) {
        throw AuthExceptions.customException(
          "Student doesn't exist",
          statusBadRequest,
        );
      }
      return await this.studentModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(studentId),
        },
        {
          isDeleted: true,
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
