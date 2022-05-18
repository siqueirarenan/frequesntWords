import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Repository } from 'typeorm';
import { Base } from './base.entity';
import { BaseRepo } from './base.repository';

export class BaseTransactionRepo<T extends Base> extends BaseRepo<T> {
  constructor(
    protected repo: Repository<T>,
    @Inject(REQUEST) protected req: any,
  ) {
    super(repo);
  }

  useTransaction() {
    this.repository = this.req.queryRunner.manager.withRepository(
      this.repository,
    );
  }
}
