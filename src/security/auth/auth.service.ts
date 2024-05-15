import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync } from 'bcrypt';
import { Model } from 'mongoose';
import { UserType } from 'src/common/constants';
import { LoginDto } from 'src/common/dto/login.dto';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { User, UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async loginUser(body: LoginDto) {
    try {
      let findUser = await this.userModel.findOne({
        email: body.email,
        role: body.role,
      });
      if (!findUser) {
        throw AuthExceptions.AccountNotFound();
      }
      const isPasswordMatch = await compareSync(
        body.password,
        findUser.password,
      );
      if (!isPasswordMatch) {
        throw AuthExceptions.InvalidIdPassword();
      }
      const payload = {
        id: findUser._id,
        email: findUser.email,
        userType: body.role,
      };
      const loginToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_TOKEN_SECRET,
        expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
      });

      findUser = findUser.toJSON();
      delete findUser.password;

      return {
        ...findUser,
        token: loginToken,
      };
    } catch (error) {
      throw AuthExceptions.customException(
        error.message,
        error.response.error,
        error.status,
      );
    }
  }
}
