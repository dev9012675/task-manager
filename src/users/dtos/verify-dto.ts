import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
