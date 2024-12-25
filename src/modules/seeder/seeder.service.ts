import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { Gender, Role } from '../users/enums/users.enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seed() {
    const check = await this.userModel.find({ role: Role.Admin });
    if (check.length === 0) {
      const salt = await bcrypt.genSalt();
      const admin = new this.userModel({
        firstName: `Admin`,
        lastName: `User`,
        email: `admin@mail.com`,
        password: await bcrypt.hash(`admin`, salt),
        gender: Gender.Male,
        phone: `+928111125`,
        role: Role.Admin,
        isTrialActive: false,
        isVerified: true,
      });
      const user = await admin.save();
      if (!user) {
        throw new Error(`There was some error in creating the admin`);
      }
      console.log(`Admin created successfully`);
    }
    return;
  }
}
