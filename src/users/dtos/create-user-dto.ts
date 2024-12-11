import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Gender, Role } from '../enums/users.enums';
import { CreateWorkerDTO } from './worker-dto';
import { Type } from 'class-transformer';

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

  @ValidateIf((o) => o.role === Role.Worker)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateWorkerDTO)
  worker?: CreateWorkerDTO;
}
