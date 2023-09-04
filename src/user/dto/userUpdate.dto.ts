import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { NameFormat } from 'src/utils/helpers';

export class userUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => NameFormat(value))
  @MinLength(3, { message: 'First name must be greater than 3 characters!' })
  @MaxLength(64, { message: 'First name must be lower than 64 characters!' })
  readonly first_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => NameFormat(value))
  @MinLength(3, { message: 'Last name must be greater than 3 characters!' })
  @MaxLength(64, { message: 'Last name must be lower than 64 characters!' })
  readonly last_name: string;

  @ApiProperty({ format: 'password', required: false })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be greater than 8 characters!' })
  @MaxLength(32, { message: 'Password must be lower than 32 characters!' })
  readonly current_password: string;

  @ApiProperty({ format: 'password', required: false })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be greater than 8 characters!' })
  @MaxLength(32, { message: 'Password must be lower than 32 characters!' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one lowercase, one uppercase letter, one numeric digit, and one special character & should be of 8 - 16 characters!',
  })
  readonly new_password: string;
}
