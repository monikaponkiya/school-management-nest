import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { CommonService } from 'src/common/services/common.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService, CommonService],
})
export class ImageModule {}
