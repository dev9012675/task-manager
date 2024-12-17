import { IsArray, IsMongoId, IsOptional } from 'class-validator';

export class UpdateManagerDTO {
  @IsOptional()
  @IsArray()
  @IsMongoId()
  team?: string[];
}
