import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class SendEmailService {
  constructor(@InjectQueue('welcome') private readonly welcomeQueue: Queue) {}

  async sendWelcomeEmail(email: string, name: string) {
    console.log('ENTROU NO SEND WELCOME EMAIL');
    await this.welcomeQueue.add('send-welcome-email', { email, name });
  }
}
