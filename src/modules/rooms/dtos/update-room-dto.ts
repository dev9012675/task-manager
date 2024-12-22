import { IsArray, IsBoolean, IsMongoId, IsOptional } from 'class-validator';
export class UpdateRoomDTO {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  members?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
