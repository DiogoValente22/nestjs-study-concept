import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserWelcomeProcessor } from './jobs/user-welcome.processor';
import { UserIdCheckMiddleware } from 'src/common/middlewares/user-id-check.middleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BullModule.registerQueue({
      name: 'user-welcome',
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserWelcomeProcessor],
  exports: [UserService, MongooseModule],
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
