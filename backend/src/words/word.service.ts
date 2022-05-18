import { Injectable } from '@nestjs/common';
import { Word } from './Word.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { WordResponseDto } from './DTO/wordResponse.dto';
import { WordRepo } from './word.repository';
import { UserKnowlegeRepo } from '../userKnowleges/userKnowlege.repository';
import { UserKnowlege } from '../userKnowleges/userKnowlege.entity';

@Injectable()
export class WordService {
  constructor(
    private wordRepo: WordRepo,
    private userKnowledgeRepo: UserKnowlegeRepo,
    @InjectMapper() private mapper: Mapper,
  ) {}

  async findAll(languageId: number): Promise<WordResponseDto[]> {
    const Words = await this.wordRepo.findAll({ languageId });

    return this.mapper.mapArray(Words, Word, WordResponseDto);
  }

  async findById(id: number): Promise<WordResponseDto> {
    const word = await this.wordRepo.findById(id);

    return this.mapper.map(word, Word, WordResponseDto);
  }

  async getNextWord(
    languageId: number,
    userId: number,
  ): Promise<WordResponseDto> {
    let knowledge = await this.userKnowledgeRepo.findNext(userId, languageId);

    if (!knowledge) {
      knowledge = await this.userKnowledgeRepo.findHighestWord(
        userId,
        languageId,
      );
      let word: Word;
      if (!knowledge) {
        word = await this.wordRepo.findOne({ languageId });
      } else {
        word = await this.wordRepo.findNextWord(languageId, knowledge.wordId);
      }
      return this.mapper.map(word, Word, WordResponseDto);
    }

    const response = this.mapper.map(knowledge.word, Word, WordResponseDto);
    if (
      (knowledge.knowledge >= 20 && knowledge.knowledge < 30) ||
      (knowledge.knowledge >= 40 && knowledge.knowledge < 50) ||
      knowledge.knowledge >= 60
    ) {
      response.reverse = true;
    }

    return response;
  }

  async right(
    wordId: number,
    userId: number,
    percent: number,
  ): Promise<WordResponseDto> {
    let knowledge = (
      await this.userKnowledgeRepo.findAll({ userId, wordId })
    )[0];

    if (!knowledge) {
      knowledge = new UserKnowlege();
      knowledge.wordId = wordId;
      knowledge.userId = userId;
      knowledge.knowledge = percent;
    } else {
      knowledge.knowledge += percent;
    }

    const newKnowledge = await this.userKnowledgeRepo.upsert(knowledge);
    return this.getNextWord(newKnowledge.word.languageId, userId);
  }

  async wrong(wordId: number, userId: number): Promise<WordResponseDto> {
    let knowledge = (
      await this.userKnowledgeRepo.findAll({ userId, wordId })
    )[0];

    if (!knowledge) {
      knowledge = new UserKnowlege();
      knowledge.wordId = wordId;
      knowledge.userId = userId;
      knowledge.knowledge = 0;
    } else {
      knowledge.knowledge = 0;
    }

    const newKnowledge = await this.userKnowledgeRepo.upsert(knowledge);
    return this.getNextWord(newKnowledge.word.languageId, userId);
  }
}
