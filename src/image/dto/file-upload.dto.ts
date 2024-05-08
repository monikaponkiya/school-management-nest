import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ required: true, format: 'binary' })
  files: Array<{
    type: 'file';
    format: 'binary';
  }>;
}
