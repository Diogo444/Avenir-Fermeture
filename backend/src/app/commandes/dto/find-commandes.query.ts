export interface FindCommandesQuery {
  page?: number | string;
  pageSize?: number | string;
  include?: 'detail' | 'list' | string;
}
