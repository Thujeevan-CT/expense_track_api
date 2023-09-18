import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class forgotPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  readonly email: string;
}
