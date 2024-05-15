import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { School, SchoolDocument } from './schema/school.schema';
import mongoose, { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { welcomeTemplate } from 'src/email/emailTemplates/welcome';
import { hash } from 'bcrypt';
import { ListDto } from 'src/common/dto/list.dto';
import { CreateUpdateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name)
    private schoolModel: Model<SchoolDocument>,
    private emailService: EmailService,
  ) {}

  async createSchool(body: CreateUpdateSchoolDto) {
    try {
      const isSchoolExist = await this.schoolModel.findOne({
        email: body.email,
      });
      if (isSchoolExist) {
        throw AuthExceptions.customException(
          'School already exists with provided email',
          statusBadRequest,
        );
      }
      const randomPassword = Math.random().toString(36).slice(-8);
      const createSchoolObj = {
        ...body,
        password: await hash(randomPassword, 10),
      };
      let school = await this.schoolModel.create(createSchoolObj);
      await this.emailService.emailSender(
        school.email.toLowerCase(),
        'Please login using this password',
        `${welcomeTemplate(school, randomPassword)}`,
      );
      return school;
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async updateSchoolDetails(body: CreateUpdateSchoolDto, schoolId: string) {
    try {
      const isSchoolExist = await this.schoolModel.findOne({ _id: schoolId });
      if (!isSchoolExist) {
        throw AuthExceptions.customException(
          "School doesn't exists",
          statusBadRequest,
        );
      }
      return this.schoolModel.findOneAndUpdate(
        {
          _id: schoolId,
        },
        body,
        {
          new: true,
        },
      );
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async getSchoolList(body: ListDto) {
    try {
      const page = body.page ? Number(body.page) : 1;
      const limit = body.limit ? Number(body.limit) : 10;
      const skip = (page - 1) * limit;
      const aggregateQuery = [];
      if (body.search) {
        const regex = new RegExp(body.search.trim(), 'i');
        const or = [
          {
            name: regex,
          },
          {
            city: regex,
          },
        ];
        aggregateQuery.push({
          $match: {
            $or: or,
          },
        });
      }
      aggregateQuery.push({
        $project: {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      });
      let sortOrder = -1;
      if (body.sortOrder) {
        sortOrder = body.sortOrder === 'asc' ? 1 : -1;
      }
      aggregateQuery.push({
        $sort: { [body.sortBy ? `${body.sortBy}` : 'createdAt']: sortOrder },
      });
      aggregateQuery.push({
        $facet: {
          schoolList: [{ $skip: skip }, { $limit: limit }],
          total_records: [{ $count: 'count' }],
        },
      });
      let schoolList = await this.schoolModel.aggregate(aggregateQuery);
      if (schoolList && !schoolList[0]) {
        schoolList = [
          {
            total_records: 0,
            result: [],
          },
        ];
      }
      return schoolList[0];
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async getSchoolDetails(schoolId: string) {
    try {
      const isSchoolExist = await this.schoolModel.findOne({ _id: schoolId });
      if (!isSchoolExist) {
        throw AuthExceptions.customException(
          "School doesn't exists",
          statusBadRequest,
        );
      }
      const aggregateQuery = [];
      aggregateQuery.push(
        {
          $match: {
            _id: new mongoose.Types.ObjectId(schoolId),
          },
        },
        {
          $project: {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
      );
      return await this.schoolModel.aggregate(aggregateQuery);
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
