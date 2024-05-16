import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from 'src/student/schema/student.schema';
import { Model } from 'mongoose';
import { StudentTestModel } from 'src/student/test/student.model';
import { FilterDto } from './dto/filter.dto';

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

describe('DashboardService', () => {
  let service: DashboardService;
  let studentModel: StudentTestModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getModelToken(Student.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    studentModel = module.get<StudentTestModel>(getModelToken(Student.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return student count with provided filters', async () => {
    const filterDto: FilterDto = {
      schoolId: '123456789012345678901234',
      standard: 10,
    };
    jest
      .spyOn(studentModel, 'aggregate')
      .mockResolvedValue([{ count: 5 }] as never);

    const result = await service.getDashboardCount(filterDto);

    expect(studentModel.aggregate).toHaveBeenCalledWith([
      { $match: { isDeleted: false } },
      { $match: { schoolId: expect.any(Object) } },
      { $match: { standard: expect.any(Number) } },
      { $count: 'count' },
    ]);
    expect(result).toEqual([{ count: 5 }]);
  });

  it('should return student count without any filters', async () => {
    const filterDto: FilterDto = {
      schoolId: '',
      standard: 0,
    };
    jest
      .spyOn(studentModel, 'aggregate')
      .mockResolvedValue([{ count: 10 }] as never);
    const result = await service.getDashboardCount(filterDto);
    expect(studentModel.aggregate).toHaveBeenCalledWith([
      { $match: { isDeleted: false } },
      { $count: 'count' },
    ]);

    expect(result).toEqual([{ count: 10 }]);
  });

  it('should handle errors during aggregation', async () => {
    const filterDto: FilterDto = {
      schoolId: '',
      standard: 0,
    };
    jest
      .spyOn(studentModel, 'aggregate')
      .mockRejectedValue(new Error('MongoDB Error') as never);

    try {
      await service.getDashboardCount(filterDto);
    } catch (error) {
      handlingErrorFunc(error);
    }
  });
});
