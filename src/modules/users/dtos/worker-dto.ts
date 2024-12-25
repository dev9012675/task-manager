import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateWorkerDTO {
  @IsNotEmpty()
  @IsMongoId()
  manager: string;
}
