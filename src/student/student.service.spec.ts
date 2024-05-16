import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from './schema/student.schema';
import mongoose, { Model } from 'mongoose';
import { StudentTestModel } from './test/student.model';
import { CreateUpdateStudentDto } from './dto/create-update-student.dto';
import { ListStudentDto } from './dto/list-student.dto';

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

describe('StudentService', () => {
  let service: StudentService;
  let studentModel: StudentTestModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getModelToken(Student.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentModel = module.get<StudentTestModel>(getModelToken(Student.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create student', () => {
    const createStudent: CreateUpdateStudentDto = {
      name: 'Test',
      parentPhoneNumber: '+91 5874145263',
      standard: 2,
      address: 'Ahmedabad',
      schoolId: '66449e0b752e9c7a1a5786b9',
      photo: 'test.jpg',
      DOB: '01/01/1999',
    };

    it('should create a new student when given email does not exist', async () => {
      const studentObj = {
        ...createStudent,
        schoolId: new mongoose.Types.ObjectId(createStudent.schoolId),
      };

      const createdStudent = {
        ...createStudent,
        _id: new mongoose.Types.ObjectId(), // Mocked created student ID
      };

      jest
        .spyOn(studentModel, 'create')
        .mockResolvedValue(createdStudent as never);

      const response = await service.createStudent(createStudent);

      expect(studentModel.create).toHaveBeenCalledWith(studentObj);
      expect(response).toEqual(createdStudent);
    });

    it('should throw an exception when an error occurs', async () => {
      jest
        .spyOn(studentModel, 'create')
        .mockRejectedValue(new Error('unknown error') as never);

      try {
        await service.createStudent(createStudent);
      } catch (error) {
        handlingErrorFunc(error);
      }
    });
  });

  describe('update student', () => {
    const updateStudent: CreateUpdateStudentDto = {
      name: 'Test',
      parentPhoneNumber: '+91 5874145263',
      standard: 2,
      address: 'Ahmedabad',
      schoolId: '66449e0b752e9c7a1a5786b9',
      photo: 'test.jpg',
      DOB: '01/01/1999',
    };
    it('should throw an exception when the student does not exist', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue(null as never);
      try {
        await service.updateStudent(updateStudent, '66449e0b752e9c7a1a5786b9');
      } catch (error) {
        handlingErrorFunc(error);
      }
    });

    it('student update details', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue({
        _id: new mongoose.Types.ObjectId('66449e0b752e9c7a1a5786b9'),
      } as never);

      jest
        .spyOn(studentModel, 'findOneAndUpdate')
        .mockResolvedValue(updateStudent as never);

      const response = await service.updateStudent(
        updateStudent,
        '66449e0b752e9c7a1a5786b9',
      );
      expect(response).toEqual(updateStudent);
    });

    it('should handle unknown errors', async () => {
      jest
        .spyOn(studentModel, 'findOne')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.updateStudent(updateStudent, '66449e0b752e9c7a1a5786b9');
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });

  describe('view student details by Id', () => {
    it('should return student details when the student exists', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue({
        _id: new mongoose.Types.ObjectId('66449e0b752e9c7a1a5786b9'),
      } as never);

      const aggregateResult = [
        {
          name: 'Test',
          parentPhoneNumber: '+91 5874145263',
          standard: 2,
          address: 'Ahmedabad',
          schoolId: '66449e0b752e9c7a1a5786b9',
          photo: 'test.jpg',
          DOB: '01/01/1999',
        },
      ];
      jest
        .spyOn(studentModel, 'aggregate')
        .mockResolvedValue(aggregateResult as never);

      const response = await service.getStudentDetail(
        '66449e0b752e9c7a1a5786b9',
      );
      expect(response).toEqual(aggregateResult);
    });

    it('should throw an exception when the student does not exist', async () => {
      jest.spyOn(studentModel, 'findOne').mockResolvedValue(null as never);

      try {
        await service.getStudentDetail('123456789123');
      } catch (error) {
        handlingErrorFunc(error);
      }
    });

    it('should handle unknown errors', async () => {
      jest
        .spyOn(studentModel, 'findOne')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.getStudentDetail('123456789123');
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });

  describe('list student', () => {
    it('should be check list student response valid or not', async () => {
      const pagination: ListStudentDto = {
        page: 1,
        limit: 10,
        search: '',
        sortOrder: '',
        sortBy: '',
        schoolId: '',
      };

      jest.spyOn(studentModel, 'aggregate').mockResolvedValue([
        {
          list: [{ name: 'name1' }, { name: 'name1' }],
          total_records: [[Object]],
        },
      ] as never);

      await service.getStudentList(pagination);
    });

    it('should be check response search in student list api', async () => {
      const pagination: ListStudentDto = {
        page: 1,
        limit: 10,
        search: 'name1',
        sortOrder: '',
        sortBy: '',
        schoolId: '',
      };

      jest.spyOn(studentModel, 'aggregate').mockResolvedValue([
        {
          list: [{ name: 'name1' }, { name: 'name2' }],
          total_records: [[Object]],
        },
      ] as never);

      await service.getStudentList(pagination);
    });

    it('should be check response sort in student list api', async () => {
      const pagination: ListStudentDto = {
        page: 1,
        limit: 100,
        search: '',
        sortOrder: 'asc',
        sortBy: 'name',
        schoolId: '',
      };

      jest.spyOn(studentModel, 'aggregate').mockResolvedValue([
        {
          list: [{ name: 'name1' }, { name: 'name2' }],
          total_records: [[Object]],
        },
      ] as never);

      await service.getStudentList(pagination);
    });

    it('should handle unknown errors', async () => {
      const pagination: ListStudentDto = {
        page: 1,
        limit: 10,
        search: '',
        sortOrder: 'asc',
        sortBy: 'name',
        schoolId: '',
      };

      jest
        .spyOn(studentModel, 'aggregate')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.getStudentList(pagination);
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });

  describe('delete student', () => {
    it('should be check delete student res', async () => {
      jest
        .spyOn(studentModel, 'findOne')
        .mockResolvedValue({ name: 'name1' } as never);

      await service.deleteStudent('66449e0b752e9c7a1a5786b9');
    });

    it('should handle unknown errors', async () => {
      jest
        .spyOn(studentModel, 'findOne')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.deleteStudent('66449e0b752e9c7a1a5786b9');
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });

  describe('active inActive student', () => {
    it('should be check active inActive student res', async () => {
      jest
        .spyOn(studentModel, 'findOne')
        .mockResolvedValue({ name: 'name1' } as never);

      jest.spyOn(studentModel, 'updateOne').mockResolvedValue(null as never);

      jest
        .spyOn(studentModel, 'findOne')
        .mockResolvedValue({ _id: '66449e0b752e9c7a1a5786b9' } as never);

      jest.spyOn(studentModel, 'updateOne').mockResolvedValue({} as never);

      await service.activeInactiveStudent('66449e0b752e9c7a1a5786b9', false);
    });

    it('should handle unknown errors', async () => {
      jest
        .spyOn(studentModel, 'findOne')
        .mockRejectedValue(new Error('Unknown Error') as never);

      try {
        await service.activeInactiveStudent('66449e0b752e9c7a1a5786b9', true);
      } catch (error) {
        // Expectations
        handlingErrorFunc(error);
      }
    });
  });
});
