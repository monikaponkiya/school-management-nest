import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';

@Injectable()
export class ImageService {
  constructor() {}

  async imageUpload(file: any, moduleName: any) {
    try {
      if (!file) {
        throw AuthExceptions.customException(
          'Image is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!moduleName) {
        throw AuthExceptions.customException(
          'moduleName is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const path = { filename: `${moduleName}/${file.filename}` };

      return path;
    } catch (error) {
      throw AuthExceptions.customException(
        error.response.message,
        error.response.statusCode,
      );
    }
  }
}
