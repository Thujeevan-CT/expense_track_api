import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { NameFormat } from 'src/utils/helpers';

export class registerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => NameFormat(value))
  @MinLength(3, { message: 'First name must be greater than 3 characters!' })
  @MaxLength(64, { message: 'First name must be lower than 64 characters!' })
  readonly first_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required!' })
  @IsString()
  @Transform(({ value }) => NameFormat(value))
  @MinLength(3, { message: 'Last name must be greater than 3 characters!' })
  @MaxLength(64, { message: 'Last name must be lower than 64 characters!' })
  readonly last_name: string;

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
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one lowercase, one uppercase letter, one numeric digit, and one special character & should be of 8 - 16 characters!',
  })
  readonly password: string;
}
