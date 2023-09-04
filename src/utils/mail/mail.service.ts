import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailActions } from '../enums';

type ActivateMailType = {
  name: string;
  email: string;
  token: string;
};

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  @OnEvent(EmailActions.FORGOT_PASSWORD_EMAIL)
  async sendForgotPasswordMail(data: ActivateMailType) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Reset your password',
      template: './reset-password',
      context: {
        name: data.name,
        code: data.code,
      },
    });
  }
}
