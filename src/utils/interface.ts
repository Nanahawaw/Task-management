export interface TaskFilterParams {
  page: number;
  limit: number;
  status?: string;
  tags?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
