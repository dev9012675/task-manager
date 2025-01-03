import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  room: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
