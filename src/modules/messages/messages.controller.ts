import {
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  Body,
  Get,
  Res,
  Query,
} from '@nestjs/common';
import { CreateMessageDTO } from './dtos/create-message-dto';
import { MessagesService } from './messages.service';
import { Response } from 'express';
import { SearchMessageDTO } from './dtos/message-search-dto';

@Controller('api/messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Post()
  async create(@Body() message: CreateMessageDTO) {
    console.log(`Message to be Created: ${message}`);
    return this.messageService.create(message);
  }

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async findAll(
    @Query() search: SearchMessageDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const messages = await this.messageService.findMultiple(search);
    if (messages.length === 0) {
      res.status(204);
      return;
    }
    return messages;
  }
  /*
  @Get(`:id`)
  async findOne(
    @Param(`id`) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const message = await this.messageService.findOne(id);
    if (!message) {
      res.status(204);
      return;
    }
    return message;
  }


  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`:id`)
  async update(
    @Body() content: UpdateMessageDTO,
    @Param(`id`) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const message = await this.messageService.update(id, content);
    if (!message) {
      res.status(204);
      return;
    }
    return { message: `Message updated successfully` };
  }

  @Delete(`:id`)
  async delete(
    @Param(`id`) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const message = await this.messageService.delete(id);
    if (!message) {
      res.status(204);
      return;
    }
    return { message: `Message deleted successfully` };
  }
    */
}
