import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions, TokenExpiredError } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { AuthCheckTokenDTO } from './dto/auth-check-token.dto';
import * as bcrypt from 'bcrypt';
import { SendEmailService } from 'src/send-email/send-email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly sendEmailService: SendEmailService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createToken(user: UserDocument, options?: JwtSignOptions) {
    const payload = {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    const defaultOptions = {
      expiresIn: '7 days',
      issuer: 'login',
      audience: 'users',
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        ...defaultOptions,
        ...options,
      }),
    };
  }

  checkToken(authCheckTokenDTO: AuthCheckTokenDTO) {
    const { token } = authCheckTokenDTO;

    try {
      const data = this.jwtService.verify(token, {
        issuer: 'login',
        audience: 'users',
      });

      return data;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  //testes
  isValidToken(authCheckTokenDTO: AuthCheckTokenDTO) {
    try {
      this.checkToken(authCheckTokenDTO);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async login(authLoginDTO: AuthLoginDTO) {
    const { email, password } = authLoginDTO;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválidos.');
    }

    const encryptedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, encryptedPassword);

    if (!isValidPassword) {
      throw new UnauthorizedException('Email e/ou senha inválidos.');
    }

    return this.createToken(user);
  }

  async forget(authForgetDTO: AuthForgetDTO) {
    const { email } = authForgetDTO;
    const user = await this.userModel.findOne({ email }).exec();

    if (user) {
      const token = await this.createToken(user, {
        expiresIn: '15m',
        issuer: 'reset',
        audience: 'users',
      });

      const link = `http://localhost:3000/reset?token=${token.accessToken}`;

      // Envio de email forget password
      await this.sendEmailService.sendForgetPasswordEmail(
        email,
        user.name,
        link,
      );
    }

    return {
      message:
        'Se o e-mail informado estiver cadastrado, enviaremos instruções de recuperação.',
    };
  }

  async reset(authResetDTO: AuthResetDTO) {
    const { newPassword, token } = authResetDTO;

    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(token, {
        issuer: 'reset',
        audience: 'users',
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Token expirado. Solicite um novo link de redefinição.',
        );
      }
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const userId = payload.sub;

    const bcryptSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, bcryptSalt);

    const updateUserPassword = await this.userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );

    if (!updateUserPassword) {
      throw new NotFoundException(
        'Houve um erro ao resetar a senha. Tente novamente.',
      );
    }

    return {
      message: 'Senha redefinida com sucesso. Faça login com sua nova senha.',
    };
  }

  async register(authRegisterDTO: AuthRegisterDTO) {
    const user = await this.userService.create(authRegisterDTO);

    if (!user) {
      throw new BadRequestException('Erro ao cadastrar usuário.');
    }

    return this.createToken(user);
  }
}
