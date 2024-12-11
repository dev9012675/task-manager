import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/user.schema';
import mongoose from 'mongoose';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema()
export class Worker extends User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] })
  manager: mongoose.Schema.Types.ObjectId;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
