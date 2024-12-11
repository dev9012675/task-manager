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
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dtos/create-task-dto';
import { UpdateTaskDTO } from './dtos/update-task-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Payload } from 'src/auth/types/auth.types';
import { Role } from 'src/users/enums/users.enums';

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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(`manager`)
  async create(@Body() task: CreateTaskDTO, @CurrentUser() user: Payload) {
    return await this.taskService.create(task, user);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`:id`)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param(`id`) id: string,
    @Body() task: UpdateTaskDTO,
    @CurrentUser() user: Payload,
  ) {
    try {
      switch (user.role) {
        case Role.Manager:
          return this.taskService.update(id, task, user);

        case Role.Worker:
          return task.status
            ? this.taskService.update(id, { status: task.status }, user)
            : { message: 'Task updated successfully' };

        default:
          throw new ForbiddenException(`Invalid role.`);
      }
    } catch (error) {
      throw error;
    }
  }

  @Delete(`:id`)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(`manager`)
  async delete(@Param(`id`) id: string) {
    return await this.taskService.delete(id);
  }
}
