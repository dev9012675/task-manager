import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Gender } from '../enums/users.enums';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
