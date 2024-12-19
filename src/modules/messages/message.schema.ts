import mongoose, { Document } from 'mongoose';

export class Message extends Document {
  sender: mongoose.Schema.Types.ObjectId;

  receiver?: mongoose.Schema.Types.ObjectId;

  content: string;

  room: mongoose.Schema.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

export const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `User`,
      required: true,
    },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: `User` },
    content: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: `Room` },
  },
  { timestamps: true },
);
