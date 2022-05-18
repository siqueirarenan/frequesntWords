export interface IPaginatedResponse<T> {
  items: Array<T>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
