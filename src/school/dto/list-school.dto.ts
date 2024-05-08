import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class SchoolListDto {
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
  cityName: string;
}
