import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { FileUploadDto } from './dto/file-upload.dto';
import { Public } from 'src/security/auth/auth.decorator';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('image')
@ApiTags('Image Upload')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Post('multiple-file-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/school',
        filename: (req, file, callback) => {
          const filename = `${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() params: FileUploadDto,
  ) {
    return await this.imageService.multipleFileUpload(files, params);
  }
}
