import { IsString, MinLength } from 'class-validator';

export class CreateIncomeCategoryDto {
  @IsString()
  @MinLength(2)
  name: string;
}
