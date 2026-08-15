export interface ApiResponse {
  success: boolean;
  message: string | null;
  statusCode: number;
}

export interface ApiErrorResponse extends ApiResponse {
  errors: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
