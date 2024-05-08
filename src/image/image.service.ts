import { Injectable } from '@nestjs/common';
import { statusBadRequest } from 'src/common/constants/response.status.constant';
import * as fs from 'fs';
import * as path from 'path';
import { AuthExceptions } from 'src/common/helpers/exceptions/auth.exception';
import { CommonService } from 'src/common/services/common.service';

@Injectable()
export class ImageService {
  constructor(private commonService: CommonService) {}

  async multipleFileUpload(files, param): Promise<any> {
    try {
      if (!fs.existsSync(`./uploads/school`)) {
        fs.mkdirSync(`./uploads/school`, {
          recursive: true,
        });
      }
      const fileArray = [];
      Promise.all(
        files.map((file) => {
          if (file && !file.originalname.match(/\.(jpg|JPG|pdf|jpeg|png)$/)) {
            throw AuthExceptions.customException(
              'Only jpg,JPG,pdf files are allowed!!',
              statusBadRequest,
            );
          } else {
            const random = this.commonService.generateRandomNumber(8);
            const extension = path.extname(file.originalname);
            const fileName = random + extension;

            fileArray.push({
              name: fileName,
              url: `/uploads/school/${fileName}`,
            });

            fs.copyFile(file.path, `/uploads/school/${fileName}`, (err) => {
              if (err) {
                throw AuthExceptions.customException(
                  'Something went wrong!!',
                  statusBadRequest,
                );
              } else {
              }
            });
          }
        }),
      );
      Promise.all(files);
      return fileArray;
    } catch (error) {
      throw AuthExceptions.customException(error.message, statusBadRequest);
    }
  }
}
