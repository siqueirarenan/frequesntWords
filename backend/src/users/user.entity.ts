import { Base } from '../_database/base.entity';
import { Column, Entity, Index } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Role } from './enum/role.enum';

@Entity()
@Index('unique_name', ['name'], {
  unique: true,
  where: '"deletedAt" IS NOT NULL',
})
@Index('unique_email', ['email'], {
  unique: true,
  where: '"deletedAt" IS NOT NULL',
})
export class User extends Base {
  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  email: string;

  @AutoMap()
  @Column()
  password: string;

  @AutoMap()
  @Column({ enum: Role, default: Role.simple })
  role: Role;
}
