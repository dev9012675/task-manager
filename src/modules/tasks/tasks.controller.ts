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
  Query,
  Res,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dtos/create-task-dto';
import { UpdateTaskDTO } from './dtos/update-task-dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Payload } from 'src/modules/auth/types/auth.types';
import { Role } from 'src/modules/users/enums/users.enums';
import { TaskSearchDTO } from './dtos/task-search-dto';
import { Response } from 'express';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() search: TaskSearchDTO,
    @CurrentUser() user: Payload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    const data = await this.taskService.findAll(search, user);
    if (data[0].tasks.length === 0) {
      res.status(204);
      return;
    }

    return {
      message: 'Tasks retrieved successfully',
      data: {
        tasks: data[0]?.tasks || [],
        totalCount: data[0]?.totalCount[0]?.count || 0,
      },
    };
  }

  @Get(`:id`)
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param(`id`) id: string,
    @CurrentUser() user: Payload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    const result = await this.taskService.findOne(id, user);
    if (!result) {
      res.status(204);
      return;
    }

    return {
      message: 'Task retrieved successfully',
      data: result,
    };
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
  async create(
    @Body() task: CreateTaskDTO,
    @CurrentUser() user: Payload,
  ): Promise<IResponse> {
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
  ): Promise<IResponse> {
    try {
      switch (user.role) {
        case Role.Manager:
          return this.taskService.update(id, task, user);

        case Role.Worker:
          return task.status
            ? this.taskService.update(id, { status: task.status }, user)
            : { message: 'Workers can only update task status' };

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
