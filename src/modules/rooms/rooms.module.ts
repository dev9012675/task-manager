import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { RoomsService } from './rooms.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
