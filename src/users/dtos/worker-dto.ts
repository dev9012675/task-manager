import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorkerDTO {
  @IsNotEmpty()
  @IsMongoId()
  manager: string;
}

export class UpdateWorkerDTO {
  @IsOptional()
  @IsMongoId()
  manager?: string;
}
