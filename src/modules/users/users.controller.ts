import {
  Controller,
  Get,
  UseGuards,
  Res,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Payload } from 'src/modules/auth/types/auth.types';
import { Response } from 'express';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { VerifyDTO } from './dtos/verify-dto';
import { IResponse } from 'src/common/interfaces/response.interface';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(`:id`)
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param(`id`) id: string,
    @CurrentUser() userData: Payload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    const user = await this.userService.findById(userData.userId);
    if (!user) {
      res.status(204);
      return;
    }
    return {
      message: 'Profile data fetched successfully',
      data: user,
    };
  }

  @Get()
  async findMultiple(
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    const users = await this.userService.findMultiple();
    if (users.length === 0) {
      res.status(204);
      return;
    }
    return {
      message: 'Users fetched successfully',
      data: users,
    };
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`:id`)
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param(`id`) id: string,
    @Body()
    newData: UpdateUserDTO,
    @CurrentUser() userData: Payload,
  ): Promise<IResponse> {
    return await this.userService.update(newData, userData.userId);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Post(`:id/verify-email`)
  async verifyEmail(
    @Body() data: VerifyDTO,
    @Param(`id`) id: string,
  ): Promise<IResponse> {
    return await this.userService.verifyEmail(data);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`:id/password`)
  async updatePassword(
    @Body() data: UpdatePasswordDTO,
    @Param(`id`) id: string,
  ): Promise<IResponse> {
    return await this.userService.updatePassword(data);
  }

  @Delete(`:id`)
  @UseGuards(JwtAuthGuard)
  async delete(
    @CurrentUser() user: Payload,
    @Param(`id`) id: string,
  ): Promise<IResponse> {
    return this.userService.delete(user);
  }
}
