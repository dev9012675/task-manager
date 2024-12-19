import { Module } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMPTP_SECURE == `true`,
        auth: {
          user: process.env.MJ_API_KEY,
          pass: process.env.MJ_SECRET_KEY,
        },
      },
    }),
  ],
  providers: [UtilityService],
  exports: [UtilityService],
})
export class UtilityModule {}
