import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from './schema/school.schema';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/security/auth/auth.service';
import { Admin, AdminSchema } from 'src/admin/schema/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: School.name,
        schema: SchoolSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
  ],
  controllers: [SchoolController],
  providers: [SchoolService, EmailService, AuthService, JwtService],
})
export class SchoolModule {}
