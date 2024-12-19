import { Message } from 'src/modules/messages/message.schema';
import { Room } from 'src/modules/rooms/room.schema';

export interface ServerToClientEvents {
  newMessage: (payload: { message: Message; senderName: string }) => void;
  roomList: (payload: Room[]) => void;
  sendNotification: (payload: { description: string }) => void;
}
