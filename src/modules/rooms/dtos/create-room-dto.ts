import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRoomDTO {
  @IsNotEmpty()
  @IsMongoId()
  task: string;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  members: string[];
}
