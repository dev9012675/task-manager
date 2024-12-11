import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { priority, status } from '../enums/tasks.enums';

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(priority)
  @IsNotEmpty()
  priority: priority;

  @IsEnum(status)
  @IsOptional()
  status?: status;

  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @IsNotEmpty()
  @IsMongoId()
  worker: string;
}
