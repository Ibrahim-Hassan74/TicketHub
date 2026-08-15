export type TicketStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type SortBy = 'CreatedAt' | 'Priority' | 'Status' | 'UpdatedAt';
export type SortOrder = 'Ascending' | 'Descending';

export interface TicketResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  customerId: string;
  customerName: string;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketRequest {
  title: string;
  description: string;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export interface UpdateTicketPriorityRequest {
  priority: TicketPriority;
}

export interface AssignTicketRequest {
  agentId: string;
}

export interface TicketQueryRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}
