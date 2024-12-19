import {
  IsEmail,
  IsString,
  IsEnum,
  ValidateNested,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { Gender } from '../enums/users.enums';
import { UpdateWorkerDTO } from './worker-dto';
import { Type } from 'class-transformer';
import { UpdateManagerDTO } from './manager-dto';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateWorkerDTO)
  worker?: UpdateWorkerDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateManagerDTO)
  manager?: UpdateManagerDTO;
}
