import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { Role } from '../enum/role.enum';

export default class ResponseUserDto {
  @AutoMap()
  @Expose()
  id: number;

  @AutoMap()
  @Expose()
  name: string;

  @AutoMap()
  @Expose()
  email: string;

  @AutoMap()
  @Expose()
  role: Role;
}
