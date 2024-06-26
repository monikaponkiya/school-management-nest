import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppConfiguration from './config/app.config';
import DatabaseConfiguration from './config/database.config';
import authConfig from './config/auth.config';
import { DatabaseModule } from './provider/database/database.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './security/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ImageModule } from './image/image.module';
import { StudentModule } from './student/student.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './security/auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration, DatabaseConfiguration, authConfig],
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    ImageModule,
    StudentModule,
    DashboardModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
