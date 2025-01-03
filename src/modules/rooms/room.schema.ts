import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
    unique: true,
  })
  task: mongoose.Schema.Types.ObjectId;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
      index: true,
    },
  ])
  members: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Boolean, default: true, required: true })
  isActive: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
