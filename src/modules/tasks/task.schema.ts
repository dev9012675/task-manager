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

  @Prop({ required: true, enum: priority })
  priority: priority;

  @Prop({ required: true, enum: status, default: status.NEW })
  status: status;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  manager: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  worker: mongoose.Schema.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  collaborators?: mongoose.Schema.Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({
  title: 'text',
  description: 'text',
});
