export type { User } from './auth';

export type UserRole = 'Admin' | 'SupportAgent' | 'Customer';

export interface UserResponse {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  displayName: string;
  role: string;
}

export interface UpdateUserRequest {
  displayName: string;
  isActive: boolean;
}

export interface UserQueryRequest {
  role?: UserRole;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface AgentSummary {
  id: string;
  displayName: string;
  email: string;
}
