import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class loginDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  @MinLength(3, { message: 'Email must be greater than 3 characters!' })
  @MaxLength(64, { message: 'Email must be lower than 64 characters!' })
  readonly email: string;

  @ApiProperty({ format: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be greater than 8 characters!' })
  @MaxLength(32, { message: 'Password must be lower than 32 characters!' })
  readonly password: string;
}
