import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dtos/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDTO) {
    const salt = await bcrypt.genSalt();
    const createdUser = await this.userModel.create({
      ...user,
      password: await bcrypt.hash(user.password, salt),
    });

    delete createdUser.password;
    return { message: 'User created successfully' };
  }

  async findOne(data: Partial<User>): Promise<User & { _id: Types.ObjectId }> {
    const user = await this.userModel.findOne(data);
    if (!user) {
      throw new UnauthorizedException(`Could not find user`);
    }
    return user;
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async updateHashedRefreshToken(id: string, hashedRefreshToken: string) {
    return await this.userModel.findByIdAndUpdate(id, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }
}
