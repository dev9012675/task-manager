import { Injectable } from '@nestjs/common';
import { Room } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RoomSearchDTO } from './dtos/room-search-dto';
import { CreateRoomDTO } from './dtos/create-room-dto';
import { ClientSession } from 'mongoose';
import { UpdateRoomDTO } from './dtos/update-room-dto';
import { Payload } from '../auth/types/auth.types';
import { Role } from '../users/enums/users.enums';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(room: CreateRoomDTO, session: ClientSession) {
    const createdRoom = new this.roomModel(room);
    return await createdRoom.save({ session: session });
  }

  async findMultiple(search: RoomSearchDTO) {
    const memberFilter = search.member ? { members: search.member } : {};
    const query = { ...memberFilter };
    return this.roomModel.find(query).populate(`task`);
  }

  async update(
    taskId: mongoose.Types.ObjectId,
    data: UpdateRoomDTO,
    session: ClientSession,
  ) {
    return await this.roomModel
      .findOneAndUpdate({ task: taskId }, { ...data })
      .session(session);
  }

  async remove(taskId: mongoose.Types.ObjectId, session: ClientSession) {
    return await this.roomModel
      .findOneAndDelete({ task: taskId })
      .session(session);
  }

  async removeUser(user: Omit<Payload, 'email'>, session: ClientSession) {
    const rooms = await this.roomModel.find({ members: user.userId });
    if (rooms.length === 0) {
      return rooms;
    }
    if (user.role === Role.Worker) {
      await this.roomModel
        .updateMany(
          { members: user.userId },
          { $pull: { members: user.userId } },
        )
        .session(session);
    } else {
      await this.roomModel
        .deleteMany({ members: user.userId })
        .session(session);
    }
    return rooms;
  }

  async findOne(id: string) {
    return this.roomModel.findById(id);
  }
}
