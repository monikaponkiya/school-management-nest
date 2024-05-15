import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Admin, AdminDocument } from '../../../src/admin/schema/admin.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { School } from '../../../src/school/schema/school.schema';

describe('AuthService', () => {
  let service: AuthService;
  let adminModel: Model<AdminDocument>;
  let jwtService: JwtService;

  jest.mock('bcrypt', () => ({
    compareSync: jest.fn(), // Mocking compareSync function from bcrypt
  }));
  jest.mock('jsonwebtoken', () => ({
    signAsync: jest.fn(), // Mocking signAsync function from jsonwebtoken
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(Admin.name),
          useValue: Model,
        },
        {
          provide: getModelToken(School.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // adminModel = module.get<Model<AdminDocument>>(getModelToken(Admin.name));
    // jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
