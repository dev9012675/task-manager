import {
  ConflictException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dtos/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Manager } from 'src/managers/manager.schema';
import { Worker } from 'src/workers/worker.schema';
import { Role } from './enums/users.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Manager.name) private managerModel: Model<Manager>,
    @InjectModel(Worker.name) private workerModel: Model<Worker>,
  ) {}

  async create(user: CreateUserDTO) {
    const userCheck = await this.userModel.findOne({ email: user.email });
    if (userCheck) {
      throw new ConflictException(`Email is already in use.`);
    }

    const salt = await bcrypt.genSalt();
    /*const createdUser = await this.userModel.create({
      ...user,
      password: await bcrypt.hash(user.password, salt),
    });*/
    switch (user.role) {
      case Role.Manager:
        await this.managerModel.create({
          ...user,
          password: await bcrypt.hash(user.password, salt),
        });
        break;
      case Role.Worker:
        const { worker, ...newUser } = user;
        const managerCheck = await this.userModel.findById(worker.manager);
        if (!managerCheck || managerCheck.role !== Role.Manager) {
          throw new ConflictException(`Invalid user provided`);
        }
        const createdWorker = await this.workerModel.create({
          ...newUser,
          password: await bcrypt.hash(user.password, salt),
          ...worker,
        });
        await this.managerModel.findByIdAndUpdate(worker.manager, {
          $addToSet: { team: createdWorker._id },
        });
        break;
      default:
        throw new ForbiddenException(`Invalid role.`);
    }

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

  async findManagerById(id: string) {
    return await this.managerModel.findById(id);
  }

  async findWorkerById(id: string) {
    return await this.workerModel.findById(id);
  }

  async updateHashedRefreshToken(id: string, hashedRefreshToken: string) {
    return await this.userModel.findByIdAndUpdate(id, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }
}
