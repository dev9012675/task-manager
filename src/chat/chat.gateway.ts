import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerToClientEvents } from './types/chat.types';
import { Message } from 'src/messages/message.schema';

@WebSocketGateway({ namespace: `chat` , 
  cors: {
    origin: `*`,
  }
 })
export class ChatGateway {
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  sendMessage(message: Message) {
    this.server.emit(`newMessage`, message);
  }
}
