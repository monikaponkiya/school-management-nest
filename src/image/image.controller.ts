import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.options';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { IMAGE_UPLOAD } from 'src/common/constants/response.constants';
import { FileUploadDto } from './dto/file-upload.dto';

@Controller('image-upload')
@ApiTags('Image Upload')
@ApiBearerAuth()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions()))
  @ApiConsumes('multipart/form-data')
  @ResponseMessage(IMAGE_UPLOAD)
  imageUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: FileUploadDto,
  ) {
    return this.imageService.imageUpload(file, body.moduleName);
  }
}
