import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageDTO {
  @IsNotEmpty()
  @IsString()
  content: string;
}
