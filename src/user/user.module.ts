import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserWelcomeProcessor } from './jobs/user-welcome.processor';
import { UserIdCheckMiddleware } from 'src/middlewares/user-id-check.middleware';
import { RequestMethod } from '@nestjs/common';

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
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdCheckMiddleware)
      .forRoutes(
        { path: 'user/alterar/:id', method: RequestMethod.ALL },
        { path: 'user/delete/:id', method: RequestMethod.DELETE },
      );
  }
}
