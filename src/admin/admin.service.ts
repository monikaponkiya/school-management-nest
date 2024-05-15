import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { Model } from 'mongoose';
import { statusBadRequest } from '../common/constants/response.status.constant';
import { hash } from 'bcrypt';
import { AuthExceptions } from '../common/helpers/exceptions/auth.exception';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
  ) {}

  async createInitialAdmin() {
    try {
      const isExist = await this.adminModel.findOne({
        email: process.env.ADMIN_EMAIL,
      });
      if (!isExist) {
        const createAdminObj = {
          email: process.env.ADMIN_EMAIL,
          password: await hash(process.env.ADMIN_PASSWORD, 10),
        };
        const admin = await this.adminModel.create(createAdminObj);
        return admin;
      }
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
