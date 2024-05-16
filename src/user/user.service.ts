import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { UserType } from 'src/common/constants';
import { CreateUpdateUserDto } from './dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { ListDto } from 'src/common/dto/list.dto';
import { welcomeTemplate } from 'src/email/emailTemplates/welcome';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private emailService: EmailService,
  ) {}

  async createInitialAdmin() {
    try {
      const isExist = await this.userModel.findOne({
        email: process.env.ADMIN_EMAIL,
      });
      if (!isExist) {
        const createAdminObj: CreateUpdateUserDto = {
          name: 'Admin',
          photo: '1715598638208.jpg',
          address: 'Ahmedabad',
          zipcode: '380015',
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          email: process.env.ADMIN_EMAIL,
          role: UserType.ADMIN,
          password: await hash(process.env.ADMIN_PASSWORD, 10),
        } as never;
        const admin = await this.userModel.create(createAdminObj);
        return admin;
      }
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async createSchool(body: CreateUpdateUserDto) {
    try {
      const isSchoolExist = await this.userModel.findOne({
        email: body.email,
        role: UserType.SCHOOL,
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
        role: UserType.SCHOOL,
      };
      const school = await this.userModel.create(createSchoolObj);
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

  async updateSchool(body: CreateUpdateUserDto, schoolId: string) {
    try {
      const isSchoolExist = await this.userModel.findOne({
        _id: schoolId,
        role: UserType.SCHOOL,
      });
      if (!isSchoolExist) {
        throw AuthExceptions.customException(
          "School doesn't exists",
          statusBadRequest,
        );
      }
      return this.userModel.findOneAndUpdate(
        {
          _id: schoolId,
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

  async schoolList(body: ListDto) {
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
        $match: {
          role: UserType.SCHOOL,
        },
      });
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
      let schoolList = await this.userModel.aggregate(aggregateQuery);
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
      const isSchoolExist = await this.userModel.findOne({
        _id: schoolId,
        role: UserType.SCHOOL,
      });
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
      return await this.userModel.aggregate(aggregateQuery);
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
