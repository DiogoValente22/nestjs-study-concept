import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class SendEmailService {
  constructor(
    @InjectQueue('welcome') private readonly welcomeQueue: Queue,
    @InjectQueue('forget-password') private readonly forgetPasswordQueue: Queue,
  ) {}

  async sendWelcomeEmail(email: string, name: string) {
    console.log('ENTROU NO SEND WELCOME EMAIL');
    await this.welcomeQueue.add('send-welcome-email', { email, name });
  }

  async sendForgetPasswordEmail(email: string, name: string, link: string) {
    console.log('ENTROU NO SENDFORGETPASSOWRD EMAIL');
    await this.forgetPasswordQueue.add('send-forget-password-email', {
      email,
      name,
      link,
    });
  }
}
