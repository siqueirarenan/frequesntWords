import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseTransactionRepo } from '../_database/base.transaction.repository';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class LanguageRepo extends BaseTransactionRepo<Language> {
  constructor(
    @InjectRepository(Language) languageRepo: Repository<Language>,
    @Inject(REQUEST) protected req: any,
  ) {
    super(languageRepo, req);
  }
}
