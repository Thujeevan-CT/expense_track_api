import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Amount must positive number' })
  readonly amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Source must be greater than 3 characters!' })
  @MaxLength(254, { message: 'Source must be lower than 254 characters!' })
  readonly source: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber(undefined, { message: 'Date must be timestamp format!' })
  @IsPositive({ message: 'Date must positive number' })
  readonly date: number;
}
