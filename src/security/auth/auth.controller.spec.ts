import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { LoginDto } from 'src/common/dto/login.dto';
import { UserType } from 'src/common/constants';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('user login controller', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
      role: UserType.ADMIN,
    };
    const response = await controller.signIn(loginDto);
    expect(response).toEqual(response);
  });
});
