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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Payload } from 'src/auth/types/auth.types';
import { Response } from 'express';
import {  UpdateUserDTO } from './dtos/update-user-dto';
import { UtilityService } from 'src/utility/utility.service';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { VerifyDTO } from './dtos/verify-dto';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService , private utilityService:UtilityService) {}

  @Get(`:id`)
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param(`id`) id: string,
    @CurrentUser() userData: Payload,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const user = await this.userService.findById(userData.userId);
      if (!user) {
        res.status(204);
        return;
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async findMultiple(@Res({ passthrough: true }) res: Response) {
    const users = await this.userService.findMultiple();
    if (users.length === 0) {
      res.status(204);
      return;
    }
    return users;
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body()
    newData: UpdateUserDTO,
    @CurrentUser() userData: Payload,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.userService.update(newData, userData);
  }

  
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Post(`verify-email`)
  async verifyEmail(@Body() data:VerifyDTO){
         return await this.userService.verifyEmail(data)
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`password`)
  async updatePassword(@Body() data: UpdatePasswordDTO) {
     return await this.userService.updatePassword(data)
  }
}
