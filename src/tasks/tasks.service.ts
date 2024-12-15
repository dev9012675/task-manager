import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Model } from 'mongoose';
import { CreateTaskDTO } from './dtos/create-task-dto';
import { UpdateTaskDTO } from './dtos/update-task-dto';
import { Payload } from 'src/auth/types/auth.types';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/users/enums/users.enums';
import { RoomsService } from 'src/rooms/rooms.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private usersService: UsersService,
    private roomsService: RoomsService,
    private notificationService: NotificationsService,
  ) {}

  async findAll() {
    try {
      return await this.taskModel.find();
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.taskModel.findById(id);
      if (!task) {
        throw new NotFoundException('Task not found.');
      }
      return task;
    } catch (err) {
      throw err;
    }
  }

  async create(task: CreateTaskDTO, user: Payload) {
    try {
      const worker = await this.usersService.findWorkerById(task.worker);
      if (!worker) {
        throw new BadRequestException(`Worker not found`);
      } else if (worker.role !== Role.Worker) {
        throw new ForbiddenException(`Tasks can only be assigned to workers`);
      } else if (worker.manager.toString() !== user.userId) {
        throw new ForbiddenException(
          `Cannot assign tasks to workers outside your team.`,
        );
      }
      const createdTask = await this.taskModel.create({
        ...task,
        manager: user.userId,
      });
      await this.roomsService.create({
        task: createdTask.id,
        members: [
          createdTask.manager.toString(),
          createdTask.worker.toString(),
        ],
      });
      return { message: 'Task created successfully' };
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, data: UpdateTaskDTO, user: Payload) {
    const session = await this.taskModel.db.startSession();
    session.startTransaction();
    try {
      const task = await this.taskModel.findById(id).session(session);
      const currentUser = await this.usersService.findById(
        user.userId,
        session,
      );

      if (!task) {
        throw new NotFoundException('Task not found.');
      }

      const notificationDescription = `Task ${task.title} Has been updated`;

      if (
        !(
          currentUser.id === task.worker.toString() ||
          currentUser.id === task.manager.toString()
        )
      ) {
        throw new ForbiddenException(
          `Tasks may be modified only by their manager or worker.`,
        );
      }

      if (typeof data.worker !== `undefined`) {
        const worker = await this.usersService.findWorkerById(
          data.worker,
          session,
        );
        if (!worker) {
          throw new BadRequestException(`Worker not found`);
        } else if (worker.role !== Role.Worker) {
          throw new ForbiddenException(`Tasks can only be assigned to workers`);
        } else if (worker.manager.toString() !== user.userId) {
          throw new ForbiddenException(
            `Cannot assign tasks to workers outside your team.`,
          );
        }
      }
      console.log(data)
      const updatedTask = await this.taskModel
        .findByIdAndUpdate(id, data  , {new:true})
        .session(session);
       await this.notificationService.create({
        description: notificationDescription,
        to: [updatedTask.worker.toString(), updatedTask.manager.toString()],
      });
      

      
      await session.commitTransaction()
      return { message: 'Task updated successfully' ,
        data:updatedTask
       };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async delete(id: string) {
    try {
      const task = await this.taskModel.findByIdAndDelete(id);
      if (!task) {
        throw new NotFoundException('Task not found.');
      }
      return {
        message: 'Task deleted successfully',
      };
    } catch (err) {
      throw err;
    }
  }
}
