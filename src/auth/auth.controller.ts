import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() authLoginDTO: AuthLoginDTO) {
    return this.authService.login(authLoginDTO);
  }

  @Post('register')
  async register(@Body() authRegisterDTO: AuthRegisterDTO) {
    return this.authService.register(authRegisterDTO);
  }

  @Post('forget')
  async forget(@Body() authForgetDTO: AuthForgetDTO) {
    return this.authService.forget(authForgetDTO);
  }

  @Post('reset')
  async reset(@Body() authResetDTO: AuthResetDTO) {
    return this.authService.reset(authResetDTO);
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return { me: 'okk', data: user };
  }
}
