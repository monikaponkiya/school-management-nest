import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

describe('AuthService', () => {
  let service: AuthService;

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
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
