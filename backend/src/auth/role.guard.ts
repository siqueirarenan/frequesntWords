import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../users/enum/role.enum';
import { ROLES_KEY } from '../_common/decorators/roles.decorator';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let response = true;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    try {
      const jwt = request.get('Authorization').split(' ')[1];
      const data: JwtPayload = await this.jwtService.verifyAsync(jwt);
      if (!data) {
        response = false;
      }

      //If no roles are specified, the user must be an admin
      const userHasRole = requiredRoles
        ? requiredRoles.includes(data.role)
        : data.role == Role.admin;
      if (!userHasRole && data.role != Role.admin) {
        //Role Admin will always have access
        response = false;
      }
    } catch (err) {
      response = false;
    }
    return response;
  }
}
