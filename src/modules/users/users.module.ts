import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Worker, WorkerSchema } from 'src/modules/users/schemas/worker.schema';
import {
  Manager,
  ManagerSchema,
} from 'src/modules/users/schemas/manager.schema';
import { UsersController } from './users.controller';
import { MailModule } from 'src/modules/mail/mail.module';
import { RoomsModule } from '../rooms/rooms.module';
import { TasksModule } from '../tasks/tasks.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MessagesModule } from '../messages/messages.module';

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
    forwardRef(() => RoomsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => MessagesModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
