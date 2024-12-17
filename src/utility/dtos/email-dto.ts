import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
