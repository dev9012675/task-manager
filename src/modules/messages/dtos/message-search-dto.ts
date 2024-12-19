import { IsMongoId, IsOptional } from 'class-validator';

export class SearchMessageDTO {
  @IsOptional()
  @IsMongoId()
  room?: string;
}
