import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { priority, status } from './enums/tasks.enums';
export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: String, required: true, minlength: 1 })
  title: string;

  @Prop({ type: String, required: true, minlength: 1 })
  description: string;

  @Prop({ required: true, enum: priority, index: true })
  priority: priority;

  @Prop({ required: true, enum: status, default: status.NEW, index: true })
  status: status;

  @Prop({ type: Date, required: true, index: true })
  dueDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  manager: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  worker: mongoose.Schema.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }])
  collaborators?: mongoose.Schema.Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({
  title: 'text',
  description: 'text',
});
