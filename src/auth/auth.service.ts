import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { AuthCheckTokenDTO } from './dto/auth-check-token.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createToken(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    const jwtConfig = {
      expiresIn: '7 days',
      issuer: 'login',
      audience: 'users',
    };

    return {
      accessToken: this.jwtService.sign(payload, jwtConfig),
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

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválidos.');
    }

    // TO-DO: simular envio de email com BullMQ

    return true;
  }

  async reset(authResetDTO: AuthResetDTO) {
    // TO-DO: validar token - sem validações e exceptions, por enquanto.
    const { password, token } = authResetDTO;
    const id = '123';
    const updateUserPassword = await this.userModel.findByIdAndUpdate(
      id,
      { password },
      { new: true },
    );

    if (!updateUserPassword) {
      console.log('TO-DO: validações futuras...', token);
    }

    return this.createToken(updateUserPassword);
  }

  async register(authRegisterDTO: AuthRegisterDTO) {
    const user = await this.userService.create(authRegisterDTO);

    if (!user) {
      throw new BadRequestException('Erro ao cadastrar usuário.');
    }

    return this.createToken(user);
  }
}
