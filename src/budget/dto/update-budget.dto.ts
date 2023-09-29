import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsMongoId,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class UpdateBudgetDto {
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
}
