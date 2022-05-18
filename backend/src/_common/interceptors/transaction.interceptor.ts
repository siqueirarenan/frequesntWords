import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, tap } from 'rxjs/operators';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private entityManager: EntityManager) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    req.queryRunner = this.entityManager.connection.createQueryRunner();
    req.queryRunner.startTransaction();

    return next.handle().pipe(
      tap(async () => {
        await req.queryRunner.commitTransaction();
        await req.queryRunner.release();
      }),
      catchError(async (err) => {
        await req.queryRunner.rollbackTransaction();
        await req.queryRunner.release();
        throw err;
      }),
    );
  }
}
