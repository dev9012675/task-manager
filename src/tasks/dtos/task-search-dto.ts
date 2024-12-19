import { PaginationDTO } from 'src/common/dtos/pagination-dto';
import { priority, status } from '../enums/tasks.enums';
import { IsOptional, IsEnum, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class TaskSearchDTO extends PaginationDTO {
  @IsEnum(priority)
  @IsOptional()
  @Transform(({ value }) => (value ? value.toUpperCase() : value))
  priority?: priority;

  @IsEnum(status)
  @IsOptional()
  @Transform(({ value }) => (value ? value.toUpperCase() : value))
  status?: status;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  dueDate: Date;
}
