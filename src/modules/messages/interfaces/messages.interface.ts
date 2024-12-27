import { Types } from 'mongoose';

export interface DeleteMessage {
  rooms?: Types.ObjectId[];
  messageId?: string;
}
