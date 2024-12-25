import {
  IsString,
  IsMongoId,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { priority, status } from '../enums/tasks.enums';

export class UpdateTaskDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(priority)
  @IsOptional()
  @Transform(({ value }) => (value ? value.toUpperCase() : value))
  priority?: priority;

  @IsEnum(status)
  @IsOptional()
  @Transform(({ value }) => (value ? value.toUpperCase() : value))
  status?: status;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsMongoId()
  worker?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  collaborators?: string[];
}
