import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { SendEmailService } from './send-email.service';
import { WelcomeProcessor } from './jobs/welcome.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'welcome',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"nest-modules" ${process.env.EMAIL_USER}`,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [SendEmailService, WelcomeProcessor],
  exports: [SendEmailService],
})
export class SendEmailModule {}
