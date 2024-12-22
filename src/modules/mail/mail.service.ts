import { Injectable } from '@nestjs/common';
import { EmailDTO } from './dtos/email-dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(data: EmailDTO) {
    this.mailerService.sendMail({
      from: `${process.env.SENDER_NAME} ${process.env.SENDER_MAIL}`,
      ...data,
    });
  }
}
