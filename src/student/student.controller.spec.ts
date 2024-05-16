import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from './schema/student.schema';
import { Model } from 'mongoose';
import { ListStudentDto } from './dto/list-student.dto';

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        StudentService,
        {
          provide: getModelToken(Student.name),
          useValue: Model,
        },
        {
          provide: StudentService,
          useValue: {
            createStudent: jest.fn().mockResolvedValue({}),
            updateStudent: jest.fn().mockResolvedValue({}),
            getStudentList: jest.fn().mockResolvedValue({}),
            getStudentDetail: jest.fn().mockResolvedValue({}),
            deleteStudent: jest.fn().mockResolvedValue({}),
            activeInactiveStudent: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('student create controller', async () => {
    const body = {
      name: 'Test',
      parentPhoneNumber: '+91 5874145263',
      standard: 2,
      address: 'Ahmedabad',
      schoolId: '66449e0b752e9c7a1a5786b9',
      photo: 'test.jpg',
      DOB: '01/01/1999',
    };
    const response = await controller.createStudent(body);
    expect(response).toEqual(response);
  });

  it('Student list controller', async () => {
    const body: ListStudentDto = {
      page: 1,
      limit: 10,
      search: '',
      sortOrder: '',
      sortBy: '',
      schoolId: '',
    };
    const response = await controller.getStudentList(body);
    expect(response).toEqual(response);
  });

  it('student update controller', async () => {
    const body = {
      name: 'Test',
      parentPhoneNumber: '+91 5874145263',
      standard: 2,
      address: 'Ahmedabad',
      schoolId: '66449e0b752e9c7a1a5786b9',
      photo: 'test.jpg',
      DOB: '01/01/1999',
    };
    const response = await controller.updateStudent(
      body,
      '66449e0b752e9c7a1a5786b9',
    );
    expect(response).toEqual(response);
  });

  it('student view controller', async () => {
    const response = await controller.getStudentDetail(
      '66449e0b752e9c7a1a5786b9',
    );
    expect(response).toEqual(response);
  });

  it('student delete controller', async () => {
    const response = await controller.deleteStudent('66449e0b752e9c7a1a5786b9');
    expect(response).toEqual(response);
  });
});
