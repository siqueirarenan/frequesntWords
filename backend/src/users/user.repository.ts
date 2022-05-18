import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseTransactionRepo } from '../_database/base.transaction.repository';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UserRepo extends BaseTransactionRepo<User> {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @Inject(REQUEST) protected req: any,
  ) {
    super(userRepo, req);
  }

  async findByEmail(email: string): Promise<User> {
    this.useTransaction();
    const found = await this.userRepo.findOneOrFail({
      where: {
        email,
      },
    });
    if (!found)
      throw new NotFoundException(`User with email "${email}" not found`);
    return found;
  }
}
