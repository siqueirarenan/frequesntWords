import { Base } from '../_database/base.entity';
import { Column, Entity, Index } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity()
@Index('name', ['name'], { unique: true, where: '"deletedAt" IS NOT NULL' })
export class Language extends Base {
  @AutoMap()
  @Column({ length: 30 })
  name: string;

  @AutoMap()
  @Column({ length: 30 })
  fullName: string;

  @AutoMap()
  @Column({ length: 5 })
  code: string;
}
