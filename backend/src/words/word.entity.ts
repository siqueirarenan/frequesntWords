import { Base } from '../_database/base.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { WordType } from './enum/wordType.enum';
import { Language } from '../languages/language.entity';

@Entity()
@Index('unique_word', ['word'], {
  unique: true,
  where: '"deletedAt" IS NOT NULL',
})
export class Word extends Base {
  @AutoMap()
  @Column({ length: 100 })
  word: string;

  @AutoMap()
  @Column({ enum: WordType })
  type: WordType;

  @AutoMap()
  @Column({ length: 100 })
  pt_br: string;

  @AutoMap()
  @Column({ length: 100 })
  en_us: string;

  @AutoMap()
  @Column({ length: 100 })
  de_de: string;

  @AutoMap()
  @ManyToOne(() => Language)
  language: Language;

  @AutoMap()
  @Column()
  languageId: number;
}
