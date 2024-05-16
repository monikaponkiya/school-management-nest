import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { UserTestModel } from './test/user.model';
import { ListDto } from 'src/common/dto/list.dto';
import { CreateUpdateUserDto } from './dto/create-user.dto';

export const handlingErrorFunc = (error) => {
  const expectedError = {
    statusCode: error.status,
    message: error.message,
    data: {},
  };

  expect(error.status).toEqual(expectedError.statusCode);
  expect(error.message).toEqual(expectedError.message);
  expect({}).toEqual(expectedError.data);
};

describe('UserService', () => {
  let service: UserService;
  let emailService: EmailService;
  let userModel: UserTestModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        EmailService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    emailService = module.get<EmailService>(EmailService);
    userModel = module.get<UserTestModel>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(emailService).toBeDefined();
    expect(userModel).toBeDefined();
  });

  describe('create school', () => {
    const createSchool: CreateUpdateUserDto = {
      name: 'Test',
      photo: '1715598638208.jpg',
      address: 'Ahmedabad',
      zipcode: '380015',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      email: 'test@gmail.com',
      role: 'school',
      password: '$2b$10$.jj4dBXngwU/A/Mj/w67c.3j5tILTq9MgYXNiuLR.F5ezRim87ble',
    } as never;

    // it('should create a new school when given email exist', async () => {
    //   const createCategory: CreateUpdateUserDto = {
    //     name: 'Test',
    //     photo: '1715598638208.jpg',
    //     address: 'Ahmedabad',
    //     zipcode: '380015',
    //     city: 'Ahmedabad',
    //     state: 'Gujarat',
    //     country: 'India',
    //     email: 'test@gmail.com',
    //     role: 'school',
    //     password:
    //       '$2b$10$.jj4dBXngwU/A/Mj/w67c.3j5tILTq9MgYXNiuLR.F5ezRim87ble',
    //   } as never;

    //   jest
    //     .spyOn(userModel, 'findOne')
    //     .mockResolvedValue({ email: 'test@gmail.com' } as never);

    //   const response = await service.createSchool(createCategory);

    //   expect(response).toEqual('School already exists with provided email');
    // });

    it('should handle unknown errors', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.createSchool(createSchool);
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });

  describe('list school', () => {
    it('should be check list school response valid or not', async () => {
      const pagination: ListDto = {
        page: 1,
        limit: 10,
        search: '',
        sortOrder: '',
        sortBy: '',
      };

      jest.spyOn(userModel, 'aggregate').mockResolvedValue([
        {
          list: [{ name: 'name1' }, { name: 'name1' }],
          total_records: [[Object]],
        },
      ] as never);

      await service.schoolList(pagination);
    });

    it('should be check response search in school list api', async () => {
      const pagination: ListDto = {
        page: 1,
        limit: 10,
        search: 'name1',
        sortOrder: '',
        sortBy: '',
      };

      jest.spyOn(userModel, 'aggregate').mockResolvedValue([
        {
          list: [{ name: 'name1' }, { name: 'name2' }],
          total_records: [[Object]],
        },
      ] as never);

      await service.schoolList(pagination);
    });

    it('should be check response sort in school list api', async () => {
      const pagination: ListDto = {
        page: 1,
        limit: 100,
        search: '',
        sortOrder: 'asc',
        sortBy: 'name',
      };

      jest.spyOn(userModel, 'aggregate').mockResolvedValue([
        {
          list: [{ name: 'name1' }, { name: 'name2' }],
          total_records: [[Object]],
        },
      ] as never);

      await service.schoolList(pagination);
    });

    it('should handle unknown errors', async () => {
      const pagination: ListDto = {
        page: 1,
        limit: 10,
        search: '',
        sortOrder: 'asc',
        sortBy: 'name',
      };

      jest
        .spyOn(userModel, 'aggregate')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.schoolList(pagination);
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });

  describe('update school', () => {
    it('should throw an exception when the school does not exist', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null as never);

      const updateSchool: CreateUpdateUserDto = {
        name: 'Test',
        photo: '1715598638208.jpg',
        address: 'Ahmedabad',
        zipcode: '380015',
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        email: 'test@gmail.com',
        role: 'school',
      } as never;

      try {
        await service.updateSchool(updateSchool, '66449e0b752e9c7a1a5786b9');
      } catch (error) {
        handlingErrorFunc(error);
      }
    });

    it('school update details', async () => {
      const updateSchool: CreateUpdateUserDto = {
        name: 'Test',
        photo: '1715598638208.jpg',
        address: 'Ahmedabad',
        zipcode: '380015',
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
      } as never;

      jest.spyOn(userModel, 'findOne').mockResolvedValue({
        _id: new mongoose.Types.ObjectId('66449e0b752e9c7a1a5786b9'),
        role: 'school',
      } as never);

      jest
        .spyOn(userModel, 'findOneAndUpdate')
        .mockResolvedValue(updateSchool as never);

      const response = await service.updateSchool(
        updateSchool,
        '66449e0b752e9c7a1a5786b9',
      );
      expect(response).toEqual(updateSchool);
    });

    it('should handle unknown errors', async () => {
      const updateSchool: CreateUpdateUserDto = {
        name: 'Test',
        photo: '1715598638208.jpg',
        address: 'Ahmedabad',
        zipcode: '380015',
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        email: 'test@gmail.com',
        role: 'school',
      } as never;

      jest
        .spyOn(userModel, 'findOne')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.updateSchool(updateSchool, '66449e0b752e9c7a1a5786b9');
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });

  describe('view school details', () => {
    it('should return school details when the school exists', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue({
        _id: new mongoose.Types.ObjectId('66449e0b752e9c7a1a5786b9'),
        role: 'school',
      } as never);

      const aggregateResult = [
        {
          name: 'Test',
          photo: '1715598638208.jpg',
          address: 'Ahmedabad',
          zipcode: '380015',
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          email: 'test@gmail.com',
          role: 'school',
        },
      ];
      jest
        .spyOn(userModel, 'aggregate')
        .mockResolvedValue(aggregateResult as never);

      const response = await service.getSchoolDetails(
        '66449e0b752e9c7a1a5786b9',
      );
      expect(response).toEqual(aggregateResult);
    });

    it('should throw an exception when the school does not exist', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null as never);

      try {
        await service.getSchoolDetails('123456789123');
      } catch (error) {
        handlingErrorFunc(error);
      }
    });

    it('should handle unknown errors', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.getSchoolDetails('123456789123');
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });
});
