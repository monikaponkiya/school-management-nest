import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserType } from 'src/common/constants';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }
    return request.user.userType === UserType.ADMIN;
  }
}
