import {
  ConnectedSocket,
  MessageBody,
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
import { Payload } from 'src/auth/types/auth.types';
import { RoomsService } from 'src/rooms/rooms.service';
dotenv.config();

@WebSocketGateway({
  namespace: `chat`,
  cors: {
    origin: `*`,
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    private roomsService: RoomsService,
  ) {}

  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      console.log(client.id);
      //const { authorization } = client.handshake.headers;
      const { authorization } = client.handshake.auth;
      if (!authorization) {
        client.disconnect();
        return;
      }
      const token = authorization.split(` `)[1];
      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(`User Connected:${payload.userId}`);
      const rooms = await this.roomsService.findMultiple({
        member: payload.userId,
      });
      //console.log(rooms);
      rooms.forEach((room) => {
        console.log(`Room ID: ${room.id}`);
        client.join(room.id);
      });
      this.server.to(client.id).emit(`roomList`, rooms);
    } catch (e) {
      console.log(`The connection could not be established`);
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

  /*
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() data:{task:string} , @ConnectedSocket() client:Socket): string {
      console.log(`Join Room data:${data.task}`)
      client.join()
      return 'Hello world!';
    }
      */

  sendMessage(message: Message) {
    console.log(`Message room ID:${message.room.toString()}`);
    this.server.to(message.room.toString()).emit(`newMessage`, message);
  }
}
