import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6) //Entre {} deberia poner message y personalizar el mensaje en español.
  password: string;
}
