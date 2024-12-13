import { Controller, Get, Res, Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Response } from 'express';

@Controller('api/rooms')
export class RoomsController {
  constructor(private roomService: RoomsService) {}

  @Get()
  async findAll(@Res({ passthrough: true }) res: Response) {
    const rooms = await this.roomService.findAll();
    if (rooms.length === 0) {
      res.status(204);
      return;
    }
    return rooms;
  }

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
}
