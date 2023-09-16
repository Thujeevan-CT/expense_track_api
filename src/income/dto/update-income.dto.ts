import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class UpdateIncomeDto {
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
  readonly source: string;

  @ApiProperty({ required: false })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber(undefined, { message: 'Date must be timestamp format!' })
  readonly date: number;
}
