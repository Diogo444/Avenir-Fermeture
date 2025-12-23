export type Truthy = boolean | 'true' | 'false' | undefined;

export interface FindClientsQuery {
  q?: string;
  title?: string;
  city?: string;
  code_postal?: string | number;
  hasEmail?: Truthy;
  hasPhone?: Truthy;
  sort?: 'createdAt' | 'updatedAt' | 'lastName' | 'firstName';
  order?: 'ASC' | 'DESC' | string;
  page?: number | string;
  pageSize?: number | string;
  include?: 'summary' | 'detail' | string;
}
