import { Injectable } from '@nestjs/common';
import { LanguageRepo } from './language.repository';
import { Language } from './language.entity';
import ResponseLanguageDto from './DTO/responseLanguage.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class LanguageService {
  constructor(
    private languageRepo: LanguageRepo,
    @InjectMapper() private mapper: Mapper,
  ) {}

  async findAll(): Promise<ResponseLanguageDto[]> {
    const languages = await this.languageRepo.findAll();

    return this.mapper.mapArray(languages, Language, ResponseLanguageDto);
  }

  async findById(id: number): Promise<ResponseLanguageDto> {
    const language = await this.languageRepo.findById(id);

    return this.mapper.map(language, Language, ResponseLanguageDto);
  }
}
