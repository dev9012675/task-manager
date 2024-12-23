import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { MailModule } from '../mail/mail.module';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MailModule, UsersModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
