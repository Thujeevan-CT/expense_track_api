import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsMongoId,
  IsPositive,
} from 'class-validator';

export class UpdateExpenseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsMongoId({ message: 'Category id is not valid!' })
  readonly category_id: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'Amount must positive number' })
  readonly amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Description must be greater than 3 characters!' })
  @MaxLength(254, { message: 'Description must be lower than 254 characters!' })
  readonly description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Description must be greater than 3 characters!' })
  @MaxLength(254, { message: 'Description must be lower than 254 characters!' })
  readonly location: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber(undefined, { message: 'Date must be timestamp format!' })
  readonly date: number;
}
