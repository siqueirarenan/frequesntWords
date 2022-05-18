import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { map } from 'rxjs';
import { JwtPayload } from '../../auth/jwt-payload.interface';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    if (req.cookies?.jwt?.accessToken) {
      const jwtService = new JwtService({});
      req.userData = jwtService.decode(
        req.cookies.jwt.accessToken,
      ) as JwtPayload;
    }
    return next.handle().pipe(map((data) => this.removeNulls(data)));
  }

  private removeNulls(data: any) {
    if (data) {
      Object.keys(data).map((key) => {
        if (typeof data[key] === 'object' && data[key] !== null) {
          this.removeNulls(data[key]);
        }
        if (data[key] === null) {
          delete data[key];
        }
      });
    }
    return data;
  }
}
