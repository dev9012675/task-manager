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
  UnauthorizedException,
  Query,
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
import { Role } from './enums/users.enums';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserSearchDTO } from './dtos/user-search.dto';
import { TrialGuard } from 'src/common/guards/trial.guard';
import { ReassignWorkerDTO } from './dtos/reassign-worker.dto';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(`:id`)
  @UseGuards(JwtAuthGuard, TrialGuard)
  async findOne(
    @Param(`id`) id: string,
    @CurrentUser() userData: Payload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    if (userData.role !== Role.Admin && id !== userData.userId) {
      throw new UnauthorizedException(`Cannot access data of other users.`);
    }
    const user = await this.userService.findById(id);
    if (!user) {
      res.status(204);
      return;
    }
    return {
      message: 'Profile data fetched successfully',
      data: user,
    };
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Get()
  @UseGuards(JwtAuthGuard, TrialGuard, RoleGuard)
  @Roles([Role.Admin])
  async findMultiple(
    @Query() searchDTO: UserSearchDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    const data = await this.userService.findMultiple(searchDTO);
    console.log(data);
    if (data[0].users.length === 0) {
      res.status(204);
      return;
    }

    return {
      message: 'Users retrieved successfully',
      data: {
        users: data[0].users,
        totalCount: data[0].totalCount[0].count,
      },
    };
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`password`)
  async updatePassword(@Body() data: UpdatePasswordDTO): Promise<IResponse> {
    return await this.userService.updatePassword(data);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`:id`)
  @UseGuards(JwtAuthGuard, TrialGuard)
  async updateProfile(
    @Param(`id`) id: string,
    @Body()
    newData: UpdateUserDTO,
    @CurrentUser() userData: Payload,
  ): Promise<IResponse> {
    if (userData.role !== Role.Admin && id !== userData.userId) {
      throw new UnauthorizedException(`Cannot access data of other users.`);
    }
    return await this.userService.update(newData, id);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Post(`email-verification`)
  async verifyEmail(@Body() data: VerifyDTO): Promise<IResponse> {
    return await this.userService.verifyEmail(data);
  }

  @Patch(`:id/verify`)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.Admin])
  async verifyUser(@Param(`id`) id: string) {
    return await this.userService.verifyUser(id);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Patch(`:id/reassign`)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles([Role.Admin])
  async reassignWorker(
    @Param(`id`) id: string,
    @Body() data: ReassignWorkerDTO,
  ): Promise<IResponse> {
    return await this.userService.reassignWorkers(id, data);
  }

  @Delete(`:id`)
  @UseGuards(JwtAuthGuard, TrialGuard)
  async delete(
    @CurrentUser() user: Payload,
    @Param(`id`) id: string,
  ): Promise<IResponse> {
    if (user.role !== Role.Admin && id !== user.userId) {
      throw new UnauthorizedException(`Cannot access data of other users.`);
    }
    return this.userService.delete(id);
  }
}
