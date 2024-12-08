import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dtos/create-task-dto';
import { UpdateTaskDTO } from './dtos/update-task-dto';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  async findAll() {
    return this.taskService.findAll();
  }

  @Get(`:id`)
  async findOne(@Param(`id`) id: string) {
    return this.taskService.findOne(id);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Post()
  async create(@Body() task: CreateTaskDTO) {
    console.log(task);
    return await this.taskService.create(task);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`:id`)
  async update(@Param(`id`) id: string, @Body() task: UpdateTaskDTO) {
    return await this.taskService.update(id, task);
  }

  @Delete(`:id`)
  async delete(@Param(`id`) id: string) {
    return await this.taskService.delete(id);
  }
}
