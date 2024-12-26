import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { ClientSession, Model } from 'mongoose';
import { CreateTaskDTO } from './dtos/create-task-dto';
import { UpdateTaskDTO } from './dtos/update-task-dto';
import { Payload } from 'src/modules/auth/types/auth.types';
import { UsersService } from 'src/modules/users/users.service';
import { Role } from 'src/modules/users/enums/users.enums';
import { RoomsService } from 'src/modules/rooms/rooms.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { TaskSearchDTO } from './dtos/task-search-dto';
import { Types } from 'mongoose';
import { status } from './enums/tasks.enums';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService,
    private readonly notificationService: NotificationsService,
    private readonly messagesService: MessagesService,
  ) {}

  async findAll(searchDTO: TaskSearchDTO, user: Payload) {
    console.log(searchDTO.dueDate);
    const textFilter = searchDTO.search
      ? { $text: { $search: searchDTO.search } }
      : {};
    const priorityFilter = searchDTO.priority
      ? { priority: searchDTO.priority }
      : {};
    const statusFilter = searchDTO.status ? { status: searchDTO.status } : {};
    const dateFilter = searchDTO.dueDate
      ? {
          dueDate: {
            $gte: new Date(searchDTO.dueDate.setHours(0, 0, 0, 0)),
            $lte: new Date(searchDTO.dueDate.setHours(23, 59, 59, 999)),
          },
        }
      : {};
    const limit = searchDTO.limit ? searchDTO.limit : 5;
    const skip = searchDTO.page ? (searchDTO.page - 1) * limit : 0;
    const query = {
      ...textFilter,
      ...priorityFilter,
      ...statusFilter,
      ...dateFilter,
      ...(user.role === Role.Manager && {
        manager: new Types.ObjectId(user.userId),
      }),
      ...(user.role === Role.Worker && {
        worker: new Types.ObjectId(user.userId),
      }),
    };

    return await this.taskModel.aggregate([
      {
        $match: query,
      },

      {
        $facet: {
          tasks: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
  }

  async findOne(id: string, user: Payload) {
    return await this.taskModel.findOne({
      _id: new Types.ObjectId(id),
      ...(user.role === Role.Manager && {
        manager: new Types.ObjectId(user.userId),
      }),
      ...(user.role === Role.Worker && {
        worker: new Types.ObjectId(user.userId),
      }),
    });
  }

  async create(task: CreateTaskDTO, user: Payload) {
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
    const session = await this.taskModel.startSession();
    session.startTransaction();
    try {
      const createdTask = new this.taskModel({
        ...task,
        manager: user.userId,
      });
      await createdTask.save({ session: session });
      await this.roomsService.create(
        {
          task: createdTask.id,
          members: [
            createdTask.manager.toString(),
            createdTask.worker.toString(),
          ],
        },
        session,
      );
      await session.commitTransaction();
      return { message: 'Task created successfully', data: createdTask };
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async update(id: string, data: UpdateTaskDTO, user: Payload) {
    const task = await this.taskModel.findOne({
      _id: new Types.ObjectId(id),
      ...(user.role === Role.Manager && {
        manager: new Types.ObjectId(user.userId),
      }),
      ...(user.role === Role.Worker && {
        worker: new Types.ObjectId(user.userId),
      }),
    });

    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    if (task.status === status.COMPLETED) {
      throw new BadRequestException(`Cannot update completed task`);
    }
    if (
      typeof data.status !== `undefined` &&
      data.status === status.NEW &&
      task.status === status.IN_PROGRESS
    ) {
      throw new BadRequestException(
        `Cannot change task status from IN_PROGRESS TO NEW`,
      );
    }

    if (typeof data.worker !== `undefined`) {
      const worker = await this.usersService.findWorkerById(data.worker);
      if (!worker) {
        throw new BadRequestException(`Worker not found`);
      } else if (
        (user.role === Role.Admin && task.manager !== worker.manager) ||
        (user.role === Role.Manager &&
          worker.manager.toString() !== user.userId)
      ) {
        throw new ForbiddenException(
          `Cannot assign tasks to workers outside team.`,
        );
      }
    }
    const session = await this.taskModel.db.startSession();
    session.startTransaction();
    try {
      if (typeof data.collaborators !== `undefined`) {
        if (
          data.collaborators.includes(task.manager.toString()) ||
          (typeof data.worker === `undefined` &&
            data.collaborators.includes(task.worker.toString())) ||
          (typeof data.worker !== `undefined` &&
            data.collaborators.includes(data.worker))
        ) {
          throw new BadRequestException(
            `Task Manager or Worker cannot be assigned as collaborators`,
          );
        }
        const collaboratorCheck = await this.usersService.checkCollaborators(
          data.collaborators,
          task.manager,
        );
        if (
          collaboratorCheck.length === 0 ||
          collaboratorCheck.length !== data.collaborators.length
        ) {
          throw new BadRequestException(`Invalid collaborators provided.`);
        }
        console.log(`Check passed successfully`);

        const updatedRoom = await this.roomsService.update(
          task._id,
          {
            members: [
              ...data.collaborators,
              task.manager.toString(),
              typeof data.worker !== `undefined`
                ? data.worker
                : task.worker.toString(),
            ],
          },
          session,
        );
        if (!updatedRoom) {
          throw new Error(`There was some error in updating rooms`);
        }
      }
      console.log(data);
      const updatedTask = await this.taskModel
        .findByIdAndUpdate(id, data, { new: true })
        .session(session);

      if (updatedTask.status === status.COMPLETED) {
        await this.roomsService.update(
          updatedTask._id,
          { isActive: false },
          session,
        );
      }

      await this.notificationService.create(
        {
          description: await this.notificationService.generateDescription(
            data,
            task.title,
          ),
          to: [
            updatedTask.worker.toString(),
            updatedTask.manager.toString(),
            ...(typeof updatedTask.collaborators !== `undefined` &&
              updatedTask.collaborators.map((id) => id.toString())),
          ],
        },
        session,
      );

      await session.commitTransaction();
      return { message: 'Task updated successfully', data: updatedTask };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async delete(id: string, user: Payload) {
    const task = await this.taskModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      ...(user.role === Role.Manager && {
        manager: new Types.ObjectId(user.userId),
      }),
    });

    if (!task) {
      throw new NotFoundException('Task not found.');
    }
    const session = await this.taskModel.db.startSession();
    session.startTransaction();
    try {
      const room = await this.roomsService.remove(task._id, session);

      await this.messagesService.delete({ room: room._id }, session);
      await session.commitTransaction();
      return {
        message: 'Task deleted successfully',
        data: task,
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async removeUser(user: Omit<Payload, 'email'>, session: ClientSession) {
    if (user.role === Role.Manager) {
      await this.taskModel
        .deleteMany({ manager: user.userId })
        .session(session);
      return;
    } else if (user.role === Role.Worker) {
      await this.taskModel
        .updateMany(
          { collaborators: user.userId },
          { $pull: { collaborators: user.userId } },
        )
        .session(session);

      await this.taskModel
        .updateMany({ worker: user.userId }, { worker: null })
        .session(session);

      return;
    }
  }
}
