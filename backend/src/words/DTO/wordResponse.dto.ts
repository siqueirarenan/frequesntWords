import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { WordType } from '../enum/wordType.enum';

export class WordResponseDto {
  @AutoMap()
  @Expose()
  id: number;

  @AutoMap()
  @Expose()
  word: string;

  @AutoMap()
  @Expose()
  languageId: number;

  @AutoMap()
  @Expose()
  type: WordType;

  @AutoMap()
  @Expose()
  en_us: string;

  @AutoMap()
  @Expose()
  pt_br: string;

  @AutoMap()
  @Expose()
  de_de: string;

  @Expose()
  reverse = false;
}
