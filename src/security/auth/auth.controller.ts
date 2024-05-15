import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { LoginDto } from 'src/common/dto/login.dto';
import { SIGNIN } from 'src/common/constants/response.constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @Public()
  @ResponseMessage(SIGNIN)
  @ApiBody({ type: LoginDto })
  signIn(@Body() signinData: LoginDto) {
    return this.authService.loginUser(signinData);
  }
}
