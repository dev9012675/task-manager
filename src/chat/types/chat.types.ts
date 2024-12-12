import { Message } from 'src/messages/message.schema';

export interface ServerToClientEvents {
  newMessage: (payload: Message) => void;
}
