import { IsJWT } from 'class-validator';
import { AuthLoginDTO } from './auth-login.dto';

export class AuthResetDTO extends AuthLoginDTO {
  @IsJWT()
  token: string;
}
