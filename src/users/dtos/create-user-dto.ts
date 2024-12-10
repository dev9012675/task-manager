import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Gender, Role } from '../enums/users.enums';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(Role)
  role: Role = Role.Worker;
}
