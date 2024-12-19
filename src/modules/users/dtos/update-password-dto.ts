import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsNumber()
  verificationCode: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
