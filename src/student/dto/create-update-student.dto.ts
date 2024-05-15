import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUpdateStudentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  parentPhoneNumber: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  standard: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  photo: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  DOB: string;
}
