import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { NameFormat } from 'src/utils/helpers';
import { Status } from 'src/utils/enums';

export class UpdateExpenseCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => NameFormat(value))
  @MinLength(3, { message: 'Name must be greater than 3 characters!' })
  @MaxLength(64, { message: 'Name must be lower than 64 characters!' })
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => NameFormat(value))
  @MinLength(3, { message: 'Description must be greater than 3 characters!' })
  @MaxLength(254, { message: 'Description must be lower than 254 characters!' })
  readonly description: string;

  @ApiProperty({ required: false, enum: Status })
  @IsOptional()
  @IsEnum(Status, { message: `Status must be 'active' or 'inactive'` })
  readonly status: Status;
}
