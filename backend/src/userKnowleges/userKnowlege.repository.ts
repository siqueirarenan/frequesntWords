import { Inject, Injectable } from '@nestjs/common';
import { BaseTransactionRepo } from '../_database/base.transaction.repository';
import { UserKnowlege } from './userKnowlege.entity';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class UserKnowlegeRepo extends BaseTransactionRepo<UserKnowlege> {
  constructor(
    @InjectRepository(UserKnowlege)
    userKnowlegeRepo: Repository<UserKnowlege>,
    @Inject(REQUEST) protected req: any,
  ) {
    super(userKnowlegeRepo, req);
  }

  async findNext(userId: number, languageId: number): Promise<UserKnowlege> {
    this.useTransaction();
    return await this.repository.findOne({
      where: {
        userId,
        word: { languageId },
        nextTime: LessThanOrEqual(new Date()),
      },
      relations: { word: true },
      order: { nextTime: 'ASC', knowledge: 'DESC' },
    });
  }

  async findHighestWord(
    userId: number,
    languageId: number,
  ): Promise<UserKnowlege> {
    this.useTransaction();
    return await this.repository.findOne({
      where: {
        userId,
        word: { languageId },
      },
      relations: { word: true },
      order: { wordId: 'DESC' },
    });
  }
}
