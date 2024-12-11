import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';

@Module({
  providers: [ManagersService],
})
export class ManagersModule {}
