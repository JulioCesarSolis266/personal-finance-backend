import {
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  categoryId: string;
}
