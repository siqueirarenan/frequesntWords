import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth/jwt-payload.interface';

export const JwtDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService({});
    const auth = request.get('Authorization');
    if (!auth) {
      throw new ForbiddenException('JWT not found in request');
    }
    return jwtService.decode(auth.split(' ')[1]) as JwtPayload;
  },
);
