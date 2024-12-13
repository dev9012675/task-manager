import { Injectable } from '@nestjs/common';
import { CreateMessageDTO } from './dtos/create-message-dto';
import { Message } from './message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatGateway } from 'src/chat/chat.gateway';
import { UpdateMessageDTO } from './dtos/update-message-dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private chatGateway: ChatGateway,
  ) {}

  async create(message: CreateMessageDTO) {
    const createdMessage = await this.messageModel.create(message);
    this.chatGateway.sendMessage(createdMessage);
    return {
      message: 'Message created successfully',
    };
  }

  async findAll() {
    return await this.messageModel.find();
  }

  async findOne(id: string) {
    return await this.messageModel.findById(id);
  }

  async update(id: string, content: UpdateMessageDTO) {
    return this.messageModel.findByIdAndUpdate(id, content);
  }

  async delete(id: string) {
    return this.messageModel.findByIdAndDelete(id);
  }
}
