import {
  IsString,
  IsMongoId,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
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
  priority?: priority;

  @IsEnum(status)
  @IsOptional()
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
