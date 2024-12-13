import { Injectable } from '@nestjs/common';
import { Room } from './room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async findAll() {
    return this.roomModel.find();
  }

  async findOne(id: string) {
    return this.roomModel.findById(id);
  }
}
