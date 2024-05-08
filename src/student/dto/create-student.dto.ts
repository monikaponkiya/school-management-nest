import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  parentPhoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  standard: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  photo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  DOB: string;
}
