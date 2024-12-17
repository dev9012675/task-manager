import {
  ConflictException,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { ClientSession, Model } from 'mongoose';
import { CreateUserDTO } from './dtos/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Manager } from 'src/managers/manager.schema';
import { Worker } from 'src/workers/worker.schema';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { Payload } from 'src/auth/types/auth.types';
import { Role } from './enums/users.enums';
import { VerifyDTO } from './dtos/verify-dto';
import { UtilityService } from 'src/utility/utility.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Manager.name) private managerModel: Model<Manager>,
    @InjectModel(Worker.name) private workerModel: Model<Worker>,
    private utilityService: UtilityService,
  ) {}

  async create(user: CreateUserDTO) {
    const userCheck = await this.userModel.findOne({ email: user.email });
    if (userCheck) {
      throw new ConflictException(`Email is already in use.`);
    }

    const salt = await bcrypt.genSalt();
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

  async findById(id: string, session?: ClientSession) {
    return session
      ? await this.userModel.findById(id).session(session)
      : await this.userModel.findById(id);
  }

  async findManagerById(id: string, session?: ClientSession) {
    return session
      ? await this.managerModel.findById(id).session(session)
      : await this.managerModel.findById(id);
  }

  async findWorkerById(id: string, session?: ClientSession) {
    return session
      ? await this.workerModel.findById(id).session(session)
      : await this.workerModel.findById(id);
  }

  async findMultiple() {
    const query = {};
    return await this.userModel.aggregate([
      {
        $match: query,
      },
      {
        $project: { hashedRefreshToken: 0, userType: 0, password: 0, __v: 0 },
      },
    ]);
  }

  async updateHashedRefreshToken(
    id: string,
    hashedRefreshToken: string,
    session?: ClientSession,
  ) {
    return await this.userModel.findByIdAndUpdate(id, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async update(newData: UpdateUserDTO, currentUser: Payload) {
    const session = await this.userModel.startSession();
    session.startTransaction();
    const manager = newData.manager ?? {};
    const worker = newData.worker ?? {};
    try {
      const userCheck = await this.userModel.findById(currentUser.userId);
      if (!userCheck) {
        throw new NotFoundException(`User not found.`);
      }

      switch (currentUser.role) {
        case Role.Manager:
          await this.managerModel
            .findByIdAndUpdate(currentUser.userId, {
              ...newData,
              ...manager,
            })
            .session(session);
          break;
        case Role.Worker:
          const managerCheck = await this.userModel
            .findById(worker.manager)
            .session(session);
          if (!managerCheck || managerCheck.role !== Role.Manager) {
            throw new ConflictException(`Invalid user provided`);
          }
          const updatedWorker = await this.workerModel
            .findByIdAndUpdate(currentUser.userId, {
              ...newData,
              ...worker,
            })
            .session(session);
          await this.managerModel
            .findByIdAndUpdate(worker.manager, {
              $addToSet: { team: updatedWorker._id },
            })
            .session(session);
          break;
        default:
          throw new ForbiddenException(`Invalid role.`);
      }

      await session.commitTransaction();
      return { message: 'User updated successfully' };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async verifyEmail(data: VerifyDTO) {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const verificationExpiration = new Date();
      verificationExpiration.setMinutes(
        verificationExpiration.getMinutes() + 5,
      );
      await this.userModel.findByIdAndUpdate(user.id, {
        verificationCode: verificationCode,
        verificationExpiration: verificationExpiration,
      });
      await this.utilityService.sendEmail({
        to: user.email,
        subject: 'Email Verification',
        text: `Your Verification Code is ${verificationCode}`,
      });
      return {
        message: 'Verification code generated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(data: UpdatePasswordDTO) {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) {
        throw new NotFoundException(`User not found`);
      } else if (
        user.verificationCode === null ||
        user.verificationCode === undefined
      ) {
        throw new BadRequestException(`No verification code found`);
      } else if (user.verificationCode !== data.verificationCode) {
        throw new BadRequestException(`Invalid Verification Code`);
      } else if (user.verificationExpiration <= new Date()) {
        throw new BadRequestException(`Verification code has expired`);
      } else {
        const salt = await bcrypt.genSalt();
        await this.userModel.findByIdAndUpdate(user.id, {
          password: await bcrypt.hash(data.newPassword, salt),
          $unset:{verificationCode:"" , verificationExpiration:""}
        });
        return { message: 'Password updated successfully' };
      }
    } catch (error) {
      throw error;
    }
  }
}
