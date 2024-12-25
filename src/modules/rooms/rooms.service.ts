import { Injectable } from '@nestjs/common';
import { Room } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RoomSearchDTO } from './dtos/room-search-dto';
import { CreateRoomDTO } from './dtos/create-room-dto';
import { ClientSession } from 'mongoose';
import { UpdateRoomDTO } from './dtos/update-room-dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(room: CreateRoomDTO) {
    return await this.roomModel.create(room);
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

  async removeUser(userId: string, session: ClientSession) {
    await this.roomModel
      .updateMany({ members: userId }, { $pull: { members: userId } })
      .session(session);
  }

  async findOne(id: string) {
    return this.roomModel.findById(id);
  }
}
