export interface ApiResponse<T = any> {
  data: T;
  errors?: ApiError[];
  meta?: PaginationMeta;
  message?: string;
}

export interface ApiError {
  code: string;
  detail: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
}

interface PaginationMeta {
  current_page: number;
  total_pages: number;
}
