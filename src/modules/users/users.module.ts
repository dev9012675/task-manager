import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { Worker, WorkerSchema } from 'src/modules/workers/worker.schema';
import { Manager, ManagerSchema } from 'src/modules/managers/manager.schema';
import { UsersController } from './users.controller';
import { MailModule } from 'src/modules/mail/mail.module';
import { RoomsModule } from '../rooms/rooms.module';
import { TasksModule } from '../tasks/tasks.module';

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
    MailModule,
    RoomsModule,
    forwardRef(() => TasksModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
