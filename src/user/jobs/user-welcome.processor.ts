import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Inject } from '@nestjs/common';
@Processor('user-welcome')
export class UserWelcomeProcessor extends WorkerHost {
  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {
    super();
  }
  async process(job: Job): Promise<void> {
    const { name, email } = job.data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bem-vindo à plataforma!',
      template: './welcome',
      context: {
        name,
        email,
      },
    });

    console.log(`E-mail real enviado para ${email}`);
    console.log('--- FIM DO JOB ---');
  }
}
