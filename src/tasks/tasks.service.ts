import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Model } from 'mongoose';
import { CreateTaskDTO } from './dtos/create-task-dto';
import { UpdateTaskDTO } from './dtos/update-task-dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

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

  async create(task: CreateTaskDTO) {
    try {
      await this.taskModel.create(task);
      return { message: 'Task created successfully' };
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, data: UpdateTaskDTO) {
    try {
      const task = await this.taskModel.findByIdAndUpdate(id, data);
      if (!task) {
        throw new NotFoundException('Task not found.');
      }
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
