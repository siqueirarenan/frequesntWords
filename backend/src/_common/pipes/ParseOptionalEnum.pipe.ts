import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseOptionalEnumPipe<T> implements PipeTransform<T> {
  constructor(protected readonly enumType: T) {}
  transform(value: any, metadata: ArgumentMetadata): T {
    if (value && !Object.values(this.enumType).includes(value))
      throw new BadRequestException(
        `Invalid value for ${metadata.data} in ${metadata.type}`,
      );
    return value;
  }
}
