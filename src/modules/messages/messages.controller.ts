import {
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  Body,
  Get,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateMessageDTO } from './dtos/create-message-dto';
import { MessagesService } from './messages.service';
import { Response } from 'express';
import { SearchMessageDTO } from './dtos/message-search-dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { TrialGuard } from 'src/common/guards/trial.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Payload } from '../auth/types/auth.types';
import { Role } from '../users/enums/users.enums';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('api/messages')
@UseGuards(JwtAuthGuard, TrialGuard, RoleGuard)
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
  @Roles([Role.Manager, Role.Worker])
  async create(
    @Body() message: CreateMessageDTO,
    @CurrentUser() user: Payload,
  ) {
    console.log(`Message to be Created: ${message}`);
    return await this.messageService.create(message, user.userId);
  }

  @Get()
  @Roles([Role.Manager, Role.Worker])
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
