import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { getTestMessageUrl } from 'nodemailer';
import { Job } from 'bullmq';

@Processor('forget-password')
export class ForgetPasswordProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job): Promise<void> {
    console.log('--- INICIO DO JOB - Forget password ---');
    const { name, link, email } = job.data;

    const info = await this.mailerService.sendMail({
      to: email,
      subject: 'Redefinição de senha',
      template: './forget-password',
      context: {
        name,
        link,
      },
    });

    console.log(`E-mail enviado para ${email}`);
    console.log('preview url: ', getTestMessageUrl(info));
    console.log('--- FIM DO JOB - Forget Password ---');
  }
}
