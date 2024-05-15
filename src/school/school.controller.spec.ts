import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { getModelToken } from '@nestjs/mongoose';
import { School } from './schema/school.schema';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';

describe('SchoolController', () => {
  let controller: SchoolController;
  let service: SchoolService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolController],
      providers: [
        SchoolService,
        EmailService,
        {
          provide: getModelToken(School.name),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<SchoolController>(SchoolController);
    service = module.get<SchoolService>(SchoolService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(emailService).toBeDefined();
  });
});
