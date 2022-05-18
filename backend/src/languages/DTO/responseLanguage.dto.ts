import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

export default class ResponseLanguageDto {
  @AutoMap()
  @Expose()
  id: number;

  @AutoMap()
  @Expose()
  name: string;
}
