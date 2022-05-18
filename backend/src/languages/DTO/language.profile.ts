import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Language } from '../language.entity';
import ResponseLanguageDto from './responseLanguage.dto';

@Injectable()
export class LanguageProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Language, ResponseLanguageDto);
    };
  }
}
