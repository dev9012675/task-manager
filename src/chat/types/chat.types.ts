import { Message } from 'src/messages/message.schema';
import { Room } from 'src/rooms/room.schema';

export interface ServerToClientEvents {
  newMessage: (payload: Message) => void;
  roomList: (payload: Room[]) => void;
  sendNotification: (payload: { description: string }) => void;
}
