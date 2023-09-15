import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { NameFormat } from 'src/utils/helpers';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => NameFormat(value))
  @MinLength(3, { message: 'Name must be greater than 3 characters!' })
  @MaxLength(64, { message: 'Name must be lower than 64 characters!' })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => NameFormat(value))
  @MinLength(3, { message: 'Description must be greater than 3 characters!' })
  @MaxLength(254, { message: 'Description must be lower than 254 characters!' })
  readonly description: string;
}
