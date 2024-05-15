import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './schema/admin.schema';

describe('AdminService', () => {
  let service: AdminService;
  let adminModel: Model<Admin>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getModelToken(Admin.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    // adminModel = module.get<Model<Admin>>(getModelToken(Admin.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
