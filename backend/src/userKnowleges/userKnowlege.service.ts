import { Injectable } from '@nestjs/common';
import { UserKnowlegeRepo } from './userKnowlege.repository';
import { UserKnowlege } from './userKnowlege.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserKnowlegeResponseDto } from './DTO/userKnowlegeResponse.dto';

@Injectable()
export class UserKnowlegeService {
  constructor(
    private userKnowledgeRepo: UserKnowlegeRepo,
    @InjectMapper() private mapper: Mapper,
  ) {}

  async findAll(userId: number): Promise<UserKnowlegeResponseDto[]> {
    const userKnowleges = await this.userKnowledgeRepo.findAll({ userId }, [
      'word',
    ]);

    return this.mapper.mapArray(
      userKnowleges,
      UserKnowlege,
      UserKnowlegeResponseDto,
    );
  }

  async findById(id: number): Promise<UserKnowlegeResponseDto> {
    const userKnowlege = await this.userKnowledgeRepo.findById(id);

    return this.mapper.map(userKnowlege, UserKnowlege, UserKnowlegeResponseDto);
  }
}
