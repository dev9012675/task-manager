import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Worker, WorkerSchema } from 'src/modules/workers/worker.schema';
import { Manager, ManagerSchema } from 'src/modules/managers/manager.schema';
import { UsersController } from './users.controller';
import { UtilityModule } from 'src/modules/utility/utility.module';

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
    UtilityModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
