export class PaginatedRequestDto {
  page = 1;

  pageSize = 10;

  orderBy = 'id';

  filterProperty?: string;
  filterValue?: string;
}
