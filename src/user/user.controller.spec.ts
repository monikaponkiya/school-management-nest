import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { ListDto } from 'src/common/dto/list.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        EmailService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: UserService,
          useValue: {
            createSchool: jest.fn().mockResolvedValue({}),
            updateSchool: jest.fn().mockResolvedValue({}),
            schoolList: jest.fn().mockResolvedValue({}),
            getSchoolDetails: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(emailService).toBeDefined();
  });

  it('create school controller', async () => {
    const body = {
      name: 'Test',
      photo: '1715598638208.jpg',
      address: 'Ahmedabad',
      zipcode: '380015',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      email: 'test@gmail.com',
      role: 'school',
    };
    const response = await controller.createSchool(body);
    expect(response).toEqual(response);
  });

  it('list of school controller', async () => {
    const body: ListDto = {
      page: 1,
      limit: 10,
      search: '',
      sortOrder: '',
      sortBy: '',
    };
    const response = await controller.schoolList(body);
    expect(response).toEqual(response);
  });

  it('update school controller', async () => {
    const body = {
      name: 'Test',
      photo: '1715598638208.jpg',
      address: 'Ahmedabad',
      zipcode: '380015',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      email: 'test@gmail.com',
      role: 'school',
    };
    const response = await controller.updateSchool(
      body,
      '66449e0b752e9c7a1a5786b9',
    );
    expect(response).toEqual(response);
  });

  it('view school controller', async () => {
    const response = await controller.getSchoolDetails(
      '66449e0b752e9c7a1a5786b9',
    );
    expect(response).toEqual(response);
  });
});
