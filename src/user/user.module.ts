import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserIdCheckMiddleware } from 'src/common/middlewares/user-id-check.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { SendEmailModule } from 'src/send-email/send-email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => SendEmailModule),
  ],
  controllers: [UserController],
  providers: [UserService],
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
