import {
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  Body,
  Get,
  Res,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateMessageDTO } from './dtos/create-message-dto';
import { MessagesService } from './messages.service';
import { Response } from 'express';
import { UpdateMessageDTO } from './dtos/update-message-dto';

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
    return this.messageService.create(message);
  }

  @Get()
  async findAll(@Res({ passthrough: true }) res: Response) {
    const messages = await  this.messageService.findAll();
    if(messages.length === 0) {
      res.status(204)
      return 
    }
    return messages
  }

  @Get(`:id`)
  async findOne(@Param(`id`) id: string, @Res({ passthrough: true }) res: Response) {
    const message = await this.messageService.findOne(id);
    if (!message) {
      res.status(204)
      return 
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
  async update(@Body() content:UpdateMessageDTO , @Param(`id`) id: string, @Res({ passthrough: true }) res: Response){
     const message = await this.messageService.update(id , content)
     if (!message) {
      res.status(204)
      return 
    }
    return {message:`Message updated successfully`};
  }

  @Delete(`:id`)
  async delete(@Param(`id`) id: string ,  @Res({ passthrough: true }) res:Response) {
    const message = await this.messageService.delete(id)
    if (!message) {
      res.status(204)
      return 
    }
    return {message:`Message deleted successfully`};
  }
}
