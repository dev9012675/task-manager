import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import { WsException } from '@nestjs/websockets';
import { UsersService } from 'src/modules/users/users.service';
dotenv.config();

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('heloooooooo');

    if (context.getType() !== `ws`) {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    //const { authorization } = client.handshake.headers;
    const { authorization } = client.handshake.auth;

    const token = authorization.split(` `)[1];
    console.log(`Token ${token}`);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(payload);
      const dbUser = await this.usersService.findById(payload.userId);
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
    } catch (error) {
      console.log(error);
      throw new WsException(`Unauthorized`);
    }
  }
}
