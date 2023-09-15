import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsMongoId,
  IsPositive,
} from 'class-validator';

export class AddExpenseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'Category id is not valid!' })
  readonly category_id: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Amount must positive number' })
  readonly amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Description must be greater than 3 characters!' })
  @MaxLength(254, { message: 'Description must be lower than 254 characters!' })
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Location must be greater than 3 characters!' })
  @MaxLength(254, { message: 'Location must be lower than 254 characters!' })
  readonly location: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  @IsNumber(undefined, { message: 'Date must be timestamp format!' })
  @IsPositive({ message: 'Date must positive number' })
  readonly date: number;
}
