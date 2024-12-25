import {
  Controller,
  Get,
  Res,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Response } from 'express';
import { RoomSearchDTO } from './dtos/room-search-dto';

@Controller('api/rooms')
export class RoomsController {
  constructor(private roomService: RoomsService) {}

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Get()
  async findMultiple(
    @Body() search: RoomSearchDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rooms = await this.roomService.findMultiple(search);
    if (rooms.length === 0) {
      res.status(204);
      return;
    }
    return rooms;
  }
  /*
  @Get(`:id`)
  async findOne(
    @Param(`id`) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const room = await this.roomService.findOne(id);
    if (!room) {
      res.status(204);
      return;
    }
    return room;
  }
    */
}
