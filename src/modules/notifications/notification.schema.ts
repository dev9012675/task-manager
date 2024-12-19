import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: String, required: true, minlength: 1 })
  description: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  ])
  to: mongoose.Schema.Types.ObjectId[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
