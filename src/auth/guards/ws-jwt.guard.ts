import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import * as dotenv from 'dotenv';
import { WsException } from '@nestjs/websockets';
dotenv.config();

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

      return true;
    } catch (error) {
      console.log(error);
      throw new WsException(`Unauthorized`);
    }
  }

  /*
  verifyToken(token:string ){
    return this.jwtService.verifyAsync(token , {
         secret: process.env.JWT_SECRET
    } )
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;

    Logger.log({ authorization }, `Got the authorization`);
    const token: string = authorization.split(` `)[1];
    const payload = 
    throw new Error(`Invalid Token`);
  }
    */
}
