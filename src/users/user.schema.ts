import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender, Role } from './enums/users.enums';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  password: string;

  @Prop({ type: String, required: true, enum: Gender })
  gender: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: String, required: true, enum: Role, default: Role.Worker })
  role: string;

  @Prop()
  hashedRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
