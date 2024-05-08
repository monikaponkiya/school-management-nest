import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/admin/schema/admin.schema';
import { UserType } from 'src/common/constants';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import { LoginDto } from 'src/common/dto/login.dto';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { School, SchoolDocument } from 'src/school/schema/school.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    @InjectModel(School.name)
    private schoolModel: Model<SchoolDocument>,
    private jwtService: JwtService,
  ) {}

  async adminLogin(body: LoginDto) {
    try {
      let admin = await this.adminModel.findOne({ email: body.email });
      if (!admin) {
        throw AuthExceptions.AccountNotFound();
      }
      const isPasswordMatch = await compareSync(body.password, admin.password);
      if (!isPasswordMatch) {
        throw AuthExceptions.InvalidIdPassword();
      }
      const payload = {
        id: admin._id,
        email: admin.email,
        userType: UserType.ADMIN,
      };
      return {
        access_token: await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_TOKEN_SECRET,
          expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
        }),
      };
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }

  async schoolLogin(body: LoginDto) {
    try {
      let school = await this.schoolModel.findOne({ email: body.email });
      if (!school) {
        throw AuthExceptions.AccountNotFound();
      }
      const isPasswordMatch = await compareSync(body.password, school.password);
      if (!isPasswordMatch) {
        throw AuthExceptions.InvalidIdPassword();
      }
      const payload = {
        id: school._id,
        email: school.email,
        userType: UserType.SCHOOL,
      };
      return {
        access_token: await this.jwtService.signAsync(payload, {
          secret: process.env.JWT_TOKEN_SECRET,
          expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
        }),
      };
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
