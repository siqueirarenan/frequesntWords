import { Base } from '../_database/base.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ManyToOne,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { User } from '../users/user.entity';
import { Word } from '../words/word.entity';

@Entity()
@Index('unique_user_word', ['userId', 'wordId'], {
  unique: true,
  where: '"deletedAt" IS NOT NULL',
})
export class UserKnowlege extends Base {
  @AutoMap()
  @Column()
  knowledge: number;

  @AutoMap()
  @Column()
  nextTime: Date;

  @AutoMap()
  @ManyToOne(() => User)
  user: User;

  @AutoMap()
  @Column()
  userId: number;

  @AutoMap()
  @ManyToOne(() => Word)
  word: Word;

  @AutoMap()
  @Column()
  wordId: number;

  @BeforeInsert()
  insertNextTime() {
    const current = new Date();
    this.nextTime = new Date(current.getTime() + 86400000);
  }

  @BeforeUpdate()
  updateNextTime() {
    const current = new Date();
    const dayInMs = 86400000;
    if (this.knowledge < 10) {
      this.nextTime = new Date(current.getTime() + dayInMs * 1);
    } else if (this.knowledge < 20) {
      this.nextTime = new Date(current.getTime() + dayInMs * 1);
    } else if (this.knowledge < 30) {
      this.nextTime = new Date(current.getTime() + dayInMs * 2);
    } else if (this.knowledge < 40) {
      this.nextTime = new Date(current.getTime() + dayInMs * 3);
    } else if (this.knowledge < 50) {
      this.nextTime = new Date(current.getTime() + dayInMs * 5);
    } else if (this.knowledge < 60) {
      this.nextTime = new Date(current.getTime() + dayInMs * 8);
    } else if (this.knowledge < 70) {
      this.nextTime = new Date(current.getTime() + dayInMs * 14);
    } else if (this.knowledge < 80) {
      this.nextTime = new Date(current.getTime() + dayInMs * 20);
    } else if (this.knowledge < 90) {
      this.nextTime = new Date(current.getTime() + dayInMs * 30);
    } else if (this.knowledge < 100) {
      this.nextTime = new Date(current.getTime() + dayInMs * 60);
    }
  }
}
