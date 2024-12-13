import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerToClientEvents } from './types/chat.types';
import { Message } from 'src/messages/message.schema';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@WebSocketGateway({
  namespace: `chat`,
  cors: {
    origin: `*`,
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      console.log(client.id);
      const { authorization } = client.handshake.headers;
      if (!authorization) {
        client.disconnect();
        return;
      }
      const token = authorization.split(` `)[1];
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (e) {
      client.disconnect();
      return;
    }

    /*try {
     
      const { authorization } = client.handshake.headers;
      if (!authorization) {
        throw new UnauthorizedException(`Credentials not present`);
      }

      const token = authorization.split(` `)[1];

      const payload =  this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(payload);

      return true;
    } catch (error) {
      console.log(error);
      console.log(`There was an authorization error`);
      client.disconnect();
      throw error;
    }
      */
  }

  /*
  afterInit(client: Socket) {
    client.use((req, next) => {});
  }*/

  sendMessage(message: Message) {
    this.server.emit(`newMessage`, message);
  }
}
