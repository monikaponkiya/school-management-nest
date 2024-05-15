import { Module, OnModuleInit } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/security/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, EmailService, AuthService, JwtService],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}
  async onModuleInit(): Promise<void> {
    await this.userService.createInitialAdmin();
  }
}
