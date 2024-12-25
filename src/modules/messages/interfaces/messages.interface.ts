import { Types } from 'mongoose';

export interface DeleteMessage {
  room?: Types.ObjectId;
  messageId?: string;
}
