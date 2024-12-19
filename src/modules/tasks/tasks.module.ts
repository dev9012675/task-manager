import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { UsersModule } from 'src/modules/users/users.module';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    UsersModule,
    RoomsModule,
    NotificationsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}