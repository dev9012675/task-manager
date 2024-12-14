import { Injectable } from '@nestjs/common';
import { Room } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomSearchDTO } from './dtos/room-search-dto';
import { CreateRoomDTO } from './dtos/create-room-dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(room: CreateRoomDTO) {
    return await this.roomModel.create(room);
  }

  async findMultiple(search: RoomSearchDTO) {
    const memberFilter = search.member ? { members: search.member } : {};
    const query = { ...memberFilter };
    return this.roomModel.find(query);
  }

  async findOne(id: string) {
    return this.roomModel.findById(id);
  }
}
