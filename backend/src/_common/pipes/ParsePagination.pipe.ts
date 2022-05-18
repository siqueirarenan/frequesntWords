import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePaginationPipe implements PipeTransform {
  transform(value: any) {
    value.page = parseInt(value.page);
    value.pageSize = parseInt(value.pageSize);
    if (isNaN(value.page) || isNaN(value.pageSize)) {
      throw new BadRequestException('Pagination page and size must be numbers');
    }
    return value;
  }
}
