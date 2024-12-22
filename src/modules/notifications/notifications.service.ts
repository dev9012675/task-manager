import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Notification } from './notification.schema';
import { CreateNotificationDTO } from './dtos/create-notification-dto';
import { ChatGateway } from 'src/modules/chat/chat.gateway';
import { UpdateTaskDTO } from 'src/modules/tasks/dtos/update-task-dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private chatGateway: ChatGateway,
  ) {}

  async findMultiple() {
    return await this.notificationModel.find();
  }

  async findOne(id: string) {
    return await this.notificationModel.findById(id);
  }

  async create(data: CreateNotificationDTO, session: ClientSession) {
    console.log(data);
    const notificationData = new this.notificationModel(data);
    const notification = await notificationData.save({ session: session });
    if (!notification) {
      throw new Error(`Notification could not be created`);
    }
    await this.chatGateway.sendNotification(notification);
  }

  async generateDescription(task: UpdateTaskDTO, taskTitle: string) {
    const titleString = `Task ${taskTitle} has been updated.The `;
    return titleString.concat(
      Object.keys(task).join(' , '),
      ' have been updated',
    );
  }

  async consume(
    notificationId: string,
    userId: string,
    session?: ClientSession,
  ) {
    return session
      ? await this.notificationModel
          .findByIdAndUpdate(notificationId, { $pull: { to: userId } })
          .session(session)
      : await this.notificationModel.findByIdAndUpdate(notificationId, {
          $pull: { to: userId },
        });
  }
}
