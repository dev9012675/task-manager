import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRoomDTO {
  @IsNotEmpty()
  @IsMongoId()
  task: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  members: string[];
}
