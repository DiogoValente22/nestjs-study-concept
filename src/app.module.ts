import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || '6379'),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
