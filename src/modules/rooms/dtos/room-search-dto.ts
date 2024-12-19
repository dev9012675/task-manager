import { IsMongoId, IsOptional } from 'class-validator';

export class RoomSearchDTO {
  @IsOptional()
  @IsMongoId()
  member?: string;
}
