import { Test, TestingModule } from '@nestjs/testing';
import { SchoolService } from './school.service';
import { School } from './schema/school.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { EmailService } from 'src/email/email.service';

describe('SchoolService', () => {
  let service: SchoolService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolService,
        EmailService,
        {
          provide: getModelToken(School.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<SchoolService>(SchoolService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(emailService).toBeDefined();
  });
});
