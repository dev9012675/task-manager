import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { User } from '../users/schemas/user.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
