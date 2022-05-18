import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseTransactionRepo } from '../_database/base.transaction.repository';
import { Repository, MoreThan } from 'typeorm';
import { Word } from './Word.entity';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class WordRepo extends BaseTransactionRepo<Word> {
  constructor(
    @InjectRepository(Word) WordRepo: Repository<Word>,
    @Inject(REQUEST) protected req: any,
  ) {
    super(WordRepo, req);
  }

  async findNextWord(languageId: number, id: number): Promise<Word> {
    this.useTransaction();
    return await this.repository.findOne({
      where: {
        id: MoreThan(id),
        languageId,
      },
      order: { id: 'ASC' },
    });
  }
}
