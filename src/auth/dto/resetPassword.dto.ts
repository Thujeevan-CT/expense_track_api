import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class resetPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly code: number;

  @ApiProperty({ format: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be greater than 8 characters!' })
  @MaxLength(32, { message: 'Password must be lower than 32 characters!' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one lowercase, one uppercase letter, one numeric digit, and one special character & should be of 8 - 16 characters!',
  })
  readonly password: string;
}
