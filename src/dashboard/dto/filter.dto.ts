import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class FilterDto {
  @ApiProperty()
  @IsOptional()
  standard: number;

  @ApiProperty()
  @IsOptional()
  schoolId: string;
}
