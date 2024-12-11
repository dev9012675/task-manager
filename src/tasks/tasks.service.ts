import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Model } from 'mongoose';
import { CreateTaskDTO } from './dtos/create-task-dto';
import { UpdateTaskDTO } from './dtos/update-task-dto';
import { Payload } from 'src/auth/types/auth.types';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/users/enums/users.enums';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private usersService: UsersService,
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
      const worker = await this.usersService.findById(task.worker);
      if (!worker) {
        throw new BadRequestException(`Worker not found`);
      } else if (worker.role !== Role.Worker) {
        throw new BadRequestException(`Task cannot be assigned to manager`);
      }
      await this.taskModel.create({ ...task, manager: user.userId });
      return { message: 'Task created successfully' };
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, data: UpdateTaskDTO, user: Payload) {
    try {
      const task = await this.taskModel.findById(id);
      //const currentUser = await this.usersService.findById(user.userId);

      if (!task) {
        throw new NotFoundException('Task not found.');
      }
      /*
      if (currentUser.id !== task.manager.toString()) {
        throw new UnauthorizedException(
          `Tasks may be modified only by the manager who created them.`,
        );
      } 
        */

      if (typeof data.worker !== `undefined`) {
        const worker = await this.usersService.findById(data.worker);
        if (!worker) {
          throw new BadRequestException(`Worker not found`);
        } else if (worker.role !== Role.Worker) {
          throw new BadRequestException(`Task cannot be assigned to manager`);
        }
      }
      await this.taskModel.findByIdAndUpdate(id, data);
      return { message: 'Task updated successfully' };
    } catch (err) {
      throw err;
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
