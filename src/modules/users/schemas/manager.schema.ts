import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import mongoose from 'mongoose';

export type ManagerDocument = HydratedDocument<Manager>;

@Schema()
export class Manager extends User {
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }])
  team: mongoose.Schema.Types.ObjectId[];
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);
