import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { getTestMessageUrl } from 'nodemailer';
import { Job } from 'bullmq';

@Processor('welcome')
export class WelcomeProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job): Promise<void> {
    console.log('--- INICIO DO JOB sendemail---');
    const { name, email } = job.data;

    const info = await this.mailerService.sendMail({
      to: email,
      subject: 'Bem-vindo à plataforma - sendemail dominio!',
      template: './welcome',
      context: {
        name,
        email,
      },
    });

    console.log(`E-mail real enviado para ${email}`);
    console.log('preview url: ', getTestMessageUrl(info));
    console.log('--- FIM DO JOB sendemail---');
  }
}
