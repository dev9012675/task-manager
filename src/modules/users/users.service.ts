import {
  ConflictException,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model, Schema } from 'mongoose';
import { CreateUserDTO } from './dtos/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { Manager } from 'src/modules/users/schemas/manager.schema';
import { Worker } from 'src/modules/users/schemas/worker.schema';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { Role } from './enums/users.enums';
import { VerifyDTO } from './dtos/verify-dto';
import { MailService } from 'src/modules/mail/mail.service';
import { Document } from 'mongoose';
import { RoomsService } from '../rooms/rooms.service';
import { TasksService } from '../tasks/tasks.service';
import { Unique } from './interfaces/users.interfaces';
import { UserSearchDTO } from './dtos/user-search.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ReassignWorkerDTO } from './dtos/reassign-worker.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Manager.name) private readonly managerModel: Model<Manager>,
    @InjectModel(Worker.name) private readonly workerModel: Model<Worker>,
    private readonly mailService: MailService,
    private readonly roomService: RoomsService,
    @Inject(forwardRef(() => TasksService))
    private readonly tasksService: TasksService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationService: NotificationsService,
  ) {}

  async create(user: CreateUserDTO) {
    let createdUser: unknown = null;
    const trialExpiration = new Date();
    trialExpiration.setMinutes(trialExpiration.getMinutes() + 5);
    const userCheck = await this.checkDuplicate({
      email: user.email,
      phone: user.phone,
      password: user.password,
    });
    if (userCheck) {
      throw new ConflictException(`Email,phone or password is already in use.`);
    }

    const salt = await bcrypt.genSalt();
    switch (user.role) {
      case Role.Manager: {
        const temp = new this.managerModel({
          ...user,
          password: await bcrypt.hash(user.password, salt),
          trialExpiration: trialExpiration,
        });
        createdUser = await temp.save();
        break;
      }
      case Role.Worker: {
        const { worker, ...newUser } = user;
        const managerCheck = await this.userModel.findById(worker.manager);

        if (!managerCheck || managerCheck.role !== Role.Manager) {
          throw new ConflictException(`Invalid user provided`);
        }
        const tempWorker = new this.workerModel({
          ...newUser,
          password: await bcrypt.hash(user.password, salt),
          trialExpiration: trialExpiration,
          ...worker,
        });

        createdUser = await tempWorker.save();
        await this.managerModel.findByIdAndUpdate(worker.manager, {
          $addToSet: { team: (createdUser as Document)._id },
        });

        break;
      }
      default:
        throw new ForbiddenException(`Invalid role.`);
    }
    return {
      message: 'User created successfully',
      data: createdUser,
    };
  }

  async checkDuplicate(data: Unique) {
    const users = await this.userModel.find({
      $or: [
        { email: data.email },
        { phone: data.phone },
        { password: data.password },
      ],
    });
    if (users.length > 0) {
      return true;
    } else {
      return false;
    }
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

  async findMultiple(searchDTO: UserSearchDTO) {
    const nameFilter = searchDTO.search
      ? { $text: { $search: searchDTO.search } }
      : {};
    const genderFilter = searchDTO.gender ? { gender: searchDTO.gender } : {};
    const roleFilter = searchDTO.role ? { role: searchDTO.role } : {};
    const limit = searchDTO.limit ? searchDTO.limit : 5;
    const skip = searchDTO.page ? (searchDTO.page - 1) * limit : 0;
    const query = { ...nameFilter, ...genderFilter, ...roleFilter };
    return await this.userModel.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          users: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                hashedRefreshToken: 0,
                userType: 0,
                password: 0,
                __v: 0,
              },
            },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
  }

  async updateHashedRefreshToken(id: string, hashedRefreshToken: string) {
    return await this.userModel.findByIdAndUpdate(id, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async update(newData: UpdateUserDTO, userId: string) {
    const userCheck = await this.userModel.findById(userId);
    if (!userCheck) {
      throw new NotFoundException(`User not found.`);
    }
    const user = await this.userModel.findByIdAndUpdate(userId, newData, {
      new: true,
      runValidators: true,
    });

    return { message: 'User updated successfully', data: user };
  }

  async verifyUser(id: string) {
    console.log(`verify User ${id}`);
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    } else if (user.isVerified === true) {
      return { message: `User is already verified` };
    }
    await this.userModel.findByIdAndUpdate(id, { isVerified: true });
    return { message: 'User verified successfully' };
  }

  async verifyEmail(data: VerifyDTO) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationExpiration = new Date();
    verificationExpiration.setMinutes(verificationExpiration.getMinutes() + 5);
    await this.userModel.findByIdAndUpdate(user.id, {
      verificationCode: verificationCode,
      verificationExpiration: verificationExpiration,
    });
    await this.mailService.sendEmail({
      to: user.email,
      subject: 'Email Verification',
      text: `Your Verification Code is ${verificationCode}`, // This is still useful for text-only clients
      html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f7fc;
                  margin: 0;
                  padding: 0;
                  color: #333;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 2px solid #eee;
                }
                .content {
                  padding: 20px 0;
                  text-align: center;
                }
                .verification-code {
                  display: inline-block;
                  font-size: 24px;
                  font-weight: bold;
                  color: #4CAF50;
                  background-color: #f0f9f4;
                  padding: 10px 20px;
                  border-radius: 5px;
                }
                .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  margin-top: 30px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Email Verification</h2>
                </div>
                <div class="content">
                  <p>Hello,</p>
                  <p>We received a request to verify your email address. Please use the verification code below to complete the process:</p>
                  <div class="verification-code">
                    ${verificationCode}
                  </div>
                  <p>If you did not request this verification, you can ignore this email.</p>
                </div>
                <div class="footer">
                  <p>Thank you for using our service!</p>
                  <p>Best regards, The [Your Service Name] Team</p>
                </div>
              </div>
            </body>
          </html>
        `,
    });
    return {
      message: 'Verification code generated successfully',
    };
  }

  async updatePassword(data: UpdatePasswordDTO) {
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
        $unset: { verificationCode: '', verificationExpiration: '' },
      });
      return { message: 'Password updated successfully' };
    }
  }

  async checkCollaborators(
    collaborators: string[],
    manager: Schema.Types.ObjectId,
  ) {
    const collaboratorIds = collaborators.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    const check = await this.workerModel.find({
      _id: { $in: collaboratorIds },
      manager: manager,
    });
    console.log(check);
    return check;
  }

  async delete(user: string) {
    const session = await this.userModel.startSession();
    session.startTransaction();
    try {
      const deletedUser = await this.userModel
        .findByIdAndDelete(user)
        .session(session);
      if (!deletedUser) {
        throw new BadRequestException(`User not found`);
      }
      await this.roomService.removeUser(
        { userId: deletedUser.id, role: deletedUser.role },
        session,
      );
      await this.tasksService.removeUser(
        { userId: deletedUser.id, role: deletedUser.role },
        session,
      );
      if (deletedUser.role === Role.Manager) {
        await this.workerModel
          .updateMany({ manager: deletedUser._id }, { manager: null })
          .session(session);
      } else if (deletedUser.role === Role.Worker) {
        await this.managerModel
          .updateMany(
            { team: deletedUser._id },
            { $pull: { team: deletedUser._id } },
          )
          .session(session);
      }

      await session.commitTransaction();
      return {
        message: `User deleted successfully`,
        data: user,
      };
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async reassignWorkers(workerId: string, data: ReassignWorkerDTO) {
    const worker = await this.workerModel.findById(workerId);
    if (!worker) {
      throw new NotFoundException(`Worker not found`);
    }
    if (worker.manager) {
      throw new BadRequestException(
        `Only workers with no managers can be reassigned`,
      );
    }
    const session = await this.workerModel.startSession();
    session.startTransaction();
    try {
      const manager = await this.managerModel
        .findByIdAndUpdate(data.managerId, {
          $addToSet: { team: workerId },
        })
        .session(session);
      if (!manager) {
        throw new NotFoundException(`Manager not found`);
      }
      const updatedWorker = await this.workerModel
        .findByIdAndUpdate(
          workerId,
          { manager: data.managerId },
          { new: true, runValidators: true },
        )
        .session(session);

      await session.commitTransaction();
      return {
        message: `Worker reassigned successfully`,
        data: updatedWorker,
      };
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async removeTrial(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        isTrialActive: false,
        $unset: { trialExpiration: `` },
      },
      { new: true },
    );
  }
}
