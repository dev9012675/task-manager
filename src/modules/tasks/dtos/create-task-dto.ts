import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { priority } from '../enums/tasks.enums';

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(priority)
  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.toUpperCase() : value))
  priority: priority;

  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @IsNotEmpty()
  @IsMongoId()
  worker: string;
}
