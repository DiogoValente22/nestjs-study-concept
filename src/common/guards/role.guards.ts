import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../enums/role.enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const requiredRules = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRules) return true;

    const { user } = context.switchToHttp().getRequest();

    console.log('user: ', user);

    if (!user) throw new UnauthorizedException();

    const hasRole =
      requiredRules.filter((role) => role === user.role).length > 0;

    if (!hasRole) throw new UnauthorizedException();

    return true;
  }
}
