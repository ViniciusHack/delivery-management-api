import {
  Notifier,
  SendMailParams,
} from '@/domain/notifications/notification/notifier';
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { EnvService } from '../env/env.service';

@Injectable()
export class ResendNotifier implements Notifier {
  constructor(private env: EnvService) {}

  async sendMail({ content, email, subject }: SendMailParams) {
    const resend = new Resend(this.env.get('RESEND_API_KEY'));

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject,
      html: `<p>${content}</p>`,
    });
  }
}
