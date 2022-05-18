import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserKnowlege } from '../userKnowlege.entity';
import { UserKnowlegeResponseDto } from './userKnowlegeResponse.dto';

@Injectable()
export class UserKnowlegeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        UserKnowlege,
        UserKnowlegeResponseDto,
        forMember(
          (x) => x.word,
          mapFrom((x) => x.word.word),
        ),
      );
    };
  }
}
