import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerToClientEvents } from './types/chat.types';
import { Message } from '../messages/message.schema';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/modules/chat/guards/ws-jwt.guard';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { Payload } from 'src/modules/auth/types/auth.types';
import { RoomsService } from '../rooms/rooms.service';
import { Notification } from '../notifications/notification.schema';
import { UsersService } from '../users/users.service';
dotenv.config();

@WebSocketGateway({
  namespace: `chat`,
  cors: {
    origin: `*`,
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private users: Map<string, Socket> = new Map();
  constructor(
    private jwtService: JwtService,
    private roomsService: RoomsService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

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
      if (!(await this.checkUser(payload.userId))) {
        client.disconnect();
        return;
      }
      console.log(`User Connected:${payload.userId}`);
      this.users.set(payload.userId, client);
      console.log(`Users`, this.users);
      const rooms = await this.roomsService.findMultiple({
        member: payload.userId,
      });
      //console.log(rooms);
      rooms.forEach((room) => {
        //console.log(`Room ID: ${room.id}`);
        console.log(`Room ID: ${room}`);
        client.join(room.id);
      });
      this.server.to(client.id).emit(`roomList`, rooms);
    } catch {
      console.log(`The connection could not be established`);
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    this.users.forEach((socket, userId) => {
      if (socket.id === client.id) {
        this.users.delete(userId);
      }
    });
    console.log(this.users);
    console.log(`User disconnected`);
  }

  sendMessage(message: Message, senderName: string) {
    console.log(`Message room ID:${message.room.toString()}`);
    this.server
      .to(message.room.toString())
      .emit(`newMessage`, { message: message, senderName: senderName });
  }

  async sendNotification(notification: Notification) {
    notification.to.forEach((user) => {
      if (this.users.has(user.toString())) {
        this.server
          .to(this.users.get(user.toString()).id)
          .emit(`sendNotification`, { description: notification.description });
      }
    });
  }

  async checkUser(userId: string) {
    const dbUser = await this.usersService.findById(userId);
    if (!dbUser) {
      return false;
    }
    if (dbUser.isTrialActive === false) {
      return true;
    }
    console.log(`Trial Guard`);
    console.log(dbUser.id);
    console.log(dbUser.trialExpiration);
    if (dbUser.trialExpiration < new Date()) {
      console.log(`Trial guard forbids access`);
      return false;
    }
    return true;
  }
}
