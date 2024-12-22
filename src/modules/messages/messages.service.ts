import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDTO } from './dtos/create-message-dto';
import { Message } from './message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatGateway } from 'src/modules/chat/chat.gateway';
import { UpdateMessageDTO } from './dtos/update-message-dto';
import { SearchMessageDTO } from './dtos/message-search-dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly chatGateway: ChatGateway,
    private readonly usersService: UsersService,
    private readonly roomService: RoomsService,
  ) {}

  async create(message: CreateMessageDTO) {
    const user = await this.usersService.findById(message.sender);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const room = await this.roomService.findOne(message.room);
    if (!room) {
      console.log(`Room not Found`);
      return;
    }

    if (room.isActive === false) {
      throw new BadRequestException(
        `Cannot send messages in deactivated rooms`,
      );
    }

    const createdMessage = await this.messageModel.create(message);
    this.chatGateway.sendMessage(
      createdMessage,
      `${user.firstName} ${user.lastName}`,
    );
    return {
      message: 'Message created successfully',
    };
  }

  async findMultiple(search: SearchMessageDTO) {
    const roomFilter = search.room ? { room: search.room } : {};
    const query = { ...roomFilter };
    return await this.messageModel
      .find(query)
      .populate(`sender`)
      .sort({ createdAt: 1 });
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
