import mongoose, { Document } from 'mongoose';

export class Message extends Document {
  sender: mongoose.Schema.Types.ObjectId;

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
    content: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: `Room`, index: true },
  },
  { timestamps: true },
);
