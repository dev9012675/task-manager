import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  sender: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  receiver?: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  room: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
