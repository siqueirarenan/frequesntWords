import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';

export class UserKnowlegeResponseDto {
  @AutoMap()
  @Expose()
  knowledge: number;

  @AutoMap()
  @Expose()
  word: string;
}
