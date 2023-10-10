import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async send ({to, subject, template, data }: {to: string, copyTo?: string|string[], subject: string, template: string, data?: any}): Promise<boolean> {
        await this.mailerService.sendMail({
          to,
          subject,
          template,
          context: {
            ...data
          },
        });

        return true;
    }
}
