import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDTO {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  to: string[];
}
