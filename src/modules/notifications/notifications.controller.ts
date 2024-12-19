import {
  Controller,
  UsePipes,
  ValidationPipe,
  Res,
  Param,
  Get,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Response } from 'express';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}
  /*
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
        */

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async findAll(@Res({ passthrough: true }) res: Response) {
    const notifications = await this.notificationsService.findMultiple();
    if (notifications.length === 0) {
      res.status(204);
      return;
    }
    return notifications;
  }

  @Get(`:id`)
  async findOne(
    @Param(`id`) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const notification = await this.notificationsService.findOne(id);
    if (!notification) {
      res.status(204);
      return;
    }
    return notification;
  }
  /*
    
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
