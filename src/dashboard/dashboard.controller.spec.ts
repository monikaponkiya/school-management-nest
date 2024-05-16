import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from 'src/student/schema/student.schema';
import { Model } from 'mongoose';
import { DashboardService } from './dashboard.service';
import { FilterDto } from './dto/filter.dto';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardService,
        {
          provide: getModelToken(Student.name),
          useValue: Model,
        },
        {
          provide: DashboardService,
          useValue: {
            getDashboardCount: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('dashboard count controller', async () => {
    const filterDto: FilterDto = {
      standard: 2,
      schoolId: '',
    };
    const response = await controller.getDashboardCount(filterDto);
    expect(response).toEqual(response);
  });
});
