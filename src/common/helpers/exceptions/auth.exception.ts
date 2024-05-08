import { HttpException, HttpStatus } from '@nestjs/common';

export const AuthExceptions = {
  AccountNotFound(): any {
    return new HttpException(
      {
        message: 'Account does not found!',
        error: 'accountNotFound',
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },
  InvalidIdPassword(): any {
    return new HttpException(
      {
        message: 'Invalid Username or Password',
        error: 'InvalidIdPassword',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  },
  customException(
    message,
    errorCode,
    statusCode = HttpStatus.BAD_REQUEST,
  ): any {
    return new HttpException(
      {
        message: message || 'Internal Server Error',
        error: errorCode,
        statusCode: statusCode,
      },
      statusCode,
    );
  },
};
