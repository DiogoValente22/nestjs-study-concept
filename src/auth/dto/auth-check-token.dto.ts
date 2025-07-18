import { IsJWT } from 'class-validator';

export class AuthCheckTokenDTO {
  @IsJWT()
  token: string;
}
