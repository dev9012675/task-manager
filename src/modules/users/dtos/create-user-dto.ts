import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  ValidateIf,
  ValidateNested,
  IsPhoneNumber,
} from 'class-validator';
import { Gender, Role } from '../enums/users.enums';
import { CreateWorkerDTO } from './worker-dto';
import { Type, Transform } from 'class-transformer';

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
  @IsPhoneNumber()
  phone: string;

  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  @IsEnum(Gender)
  gender: Gender;

  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  @IsEnum(Role)
  role: Role = Role.Worker;

  @ValidateIf((o) => o.role === Role.Worker)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateWorkerDTO)
  worker?: CreateWorkerDTO;
}
