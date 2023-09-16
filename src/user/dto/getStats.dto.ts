import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { DurationType } from 'src/utils/enums';

export class getStatsDto {
  @ApiProperty({ required: false, enum: DurationType })
  @IsOptional()
  @IsEnum(DurationType, {
    message: `Duration type must be ${DurationType.Day} or ${DurationType.Week} or ${DurationType.Month} or ${DurationType.Year}`,
  })
  readonly duration_type: string;
}
