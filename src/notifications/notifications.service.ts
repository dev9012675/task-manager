import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Notification } from './notification.schema';
import { CreateNotificationDTO } from './dtos/create-notification-dto';
import { ChatGateway } from 'src/chat/chat.gateway';

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

  async create(data: CreateNotificationDTO) {
    const notification = await this.notificationModel.create(data);
    if (!notification) {
      throw new Error(`Notification could not be created`);
    }
    await this.chatGateway.sendNotification(notification);
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
