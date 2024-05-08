import { Module, OnModuleInit } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { AuthService } from 'src/security/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { School, SchoolSchema } from 'src/school/schema/school.schema';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: School.name, schema: SchoolSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AuthService, JwtService],
})
export class AdminModule implements OnModuleInit {
  constructor(private readonly adminService: AdminService) {}
  async onModuleInit(): Promise<void> {
    await this.adminService.createInitialAdmin();
  }
}
