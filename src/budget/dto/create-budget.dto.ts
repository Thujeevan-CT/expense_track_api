import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { BudgetType } from 'src/utils/enums';

export class AddBudgetDto {
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

  @ApiProperty({ enum: BudgetType })
  @IsNotEmpty()
  @IsEnum(BudgetType, {
    message: `Budget must be '${BudgetType.Monthly}' or '${BudgetType.Weekly}'`,
  })
  readonly budget_type: BudgetType;
}
