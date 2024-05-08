import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ADMIN_LOGIN } from 'src/common/constants/response.constants';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { LoginDto } from 'src/common/dto/login.dto';
import { Public } from 'src/security/auth/auth.decorator';
import { AuthService } from 'src/security/auth/auth.service';

@Controller('admin')
@ApiTags('Admin Management')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiOperation({
    summary: 'Admin login',
  })
  @ResponseMessage(ADMIN_LOGIN)
  async login(@Body() body: LoginDto) {
    return await this.authService.adminLogin(body);
  }
}
