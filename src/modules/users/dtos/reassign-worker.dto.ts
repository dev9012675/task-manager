import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ReassignWorkerDTO {
  @IsNotEmpty()
  @IsMongoId()
  managerId: string;
}
