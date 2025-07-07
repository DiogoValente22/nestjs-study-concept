import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserWelcomeProcessor } from './jobs/user-welcome.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BullModule.registerQueue({
      name: 'user-welcome',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserWelcomeProcessor],
  exports: [],
})
export class UserModule {}
