import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/common/config/jwt.config';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    RoomsModule,
    forwardRef(() => UsersModule),
  ],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
