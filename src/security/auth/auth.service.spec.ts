import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { LoginDto } from 'src/common/dto/login.dto';
import { UserType } from 'src/common/constants';
import { UserTestModel } from 'src/user/test/user.model';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';

describe('AuthService', () => {
  let userModel: UserTestModel;
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<UserTestModel>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userModel).toBeDefined();
  });

  describe('login user', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
      role: UserType.ADMIN,
    };

    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Test',
      photo: '1715598638208.jpg',
      address: 'Ahmedabad',
      zipcode: '380015',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      email: 'test@gmail.com',
      role: 'admin',
      password: '$2b$10$.jj4dBXngwU/A/Mj/w67c.3j5tILTq9MgYXNiuLR.F5ezRim87ble',
      toJSON() {
        return { _id: this._id, email: this.email, role: this.role };
      },
    };

    it('should throw AccountNotFound when user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null as never);

      try {
        await service.signIn(loginDto);
      } catch (error) {
        expect(userModel.findOne).toHaveBeenCalledWith({
          email: loginDto.email,
          role: loginDto.role,
        });
        expect(error).toEqual(AuthExceptions.AccountNotFound());
      }
    });

    it('should throw InvalidIdPassword when password is incorrect', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser as never);
      try {
        await service.signIn(loginDto);
      } catch (error) {
        expect(userModel.findOne).toHaveBeenCalledWith({
          email: loginDto.email,
          role: loginDto.role,
        });
        expect(error).toEqual(AuthExceptions.InvalidIdPassword());
      }
    });
  });
});
