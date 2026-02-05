import {
  IsNumber,
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateIncomeDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  description?: string;
}
