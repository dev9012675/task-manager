import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Worker, WorkerSchema } from 'src/workers/worker.schema';
import { Manager, ManagerSchema } from 'src/managers/manager.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: Worker.name, schema: WorkerSchema },
          { name: Manager.name, schema: ManagerSchema },
        ],
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
