import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const smtp = configService.get('smtp');
            return {
                transport: {
                  host: smtp.host,
                  port: smtp.port,
                  secure: false,
                  auth: {
                    user: smtp.user,
                    pass: smtp.password
                  },
                },
                defaults: {
                  from: `"No Reply" <${smtp.from}`
                },
                template: {
                  dir: join(__dirname, 'templates'),
                  adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                  options: {
                    strict: true
                  }
                }
            }
        }
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
