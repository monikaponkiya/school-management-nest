import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class ListStudentDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  @IsOptional()
  search: string;

  @ApiProperty()
  @IsOptional()
  sortOrder: string;

  @ApiProperty()
  @IsOptional()
  sortBy: string;

  @ApiProperty()
  @IsOptional()
  schoolId: string;
}
