import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
@Processor('user-welcome')
export class UserWelcomeProcessor extends WorkerHost {
  async process(job: Job): Promise<void> {
    const { name, email } = job.data;

    // simulando envio de email
    console.log('--- INÍCIO DO JOB ---');
    console.log(`Enviando e-mail de boas-vindas para ${name} (${email})`);

    // simulando um tempo de processamento
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log(`E-mail enviado com sucesso para ${name}`);
    console.log('--- FIM DO JOB ---');
  }
}
