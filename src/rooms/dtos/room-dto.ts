import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class CreateRoomDTO {
  @IsNotEmpty()
  @IsMongoId()
  task: string;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  members: string[];
}
