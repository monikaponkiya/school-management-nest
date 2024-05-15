import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUpdateSchoolDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  photo: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  zipcode: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  country: string;
}
