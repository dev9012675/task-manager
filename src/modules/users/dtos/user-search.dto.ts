import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDTO } from 'src/common/dtos/pagination-dto';
import { Gender, Role } from '../enums/users.enums';
import { Transform } from 'class-transformer';

export class UserSearchDTO extends PaginationDTO {
  @IsOptional()
  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  @IsEnum(Gender)
  gender?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  @IsEnum([Role.Manager, Role.Worker])
  role?: string;
}
