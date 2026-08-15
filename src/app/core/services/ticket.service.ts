import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceService } from '../../core/services/resource.service';
import { PaginatedResponse } from '../../shared/models/api';
import {
  TicketResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  UpdateTicketStatusRequest,
  UpdateTicketPriorityRequest,
  AssignTicketRequest,
  TicketQueryRequest
} from '../../shared/models/ticket';
import { CommentResponse, CreateCommentRequest } from '../../shared/models/comment';
import { ActivityResponse } from '../../shared/models/activity';
import { TimeEntryResponse, CreateTimeEntryRequest, TicketTimeEntriesResponse } from '../../shared/models/time-entry';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends ResourceService<TicketResponse> {
  constructor() {
    super('Tickets');
  }

  getTickets(query?: TicketQueryRequest): Observable<PaginatedResponse<TicketResponse>> {
    let params = new HttpParams();
    if (query) {
      if (query.status) params = params.set('status', query.status);
      if (query.priority) params = params.set('priority', query.priority);
      if (query.search) params = params.set('search', query.search);
      if (query.sortBy) params = params.set('sortBy', query.sortBy);
      if (query.sortOrder) params = params.set('sortOrder', query.sortOrder);
      if (query.page) params = params.set('page', query.page.toString());
      if (query.pageSize) params = params.set('pageSize', query.pageSize.toString());
    }
    return this.get<PaginatedResponse<TicketResponse>>('', { params });
  }

  getTicket(id: string): Observable<TicketResponse> {
    return this.getById(id);
  }

  createTicket(req: CreateTicketRequest): Observable<TicketResponse> {
    return this.post('', req);
  }

  updateTicket(id: string, req: UpdateTicketRequest): Observable<TicketResponse> {
    return this.put(id, req);
  }

  changeStatus(id: string, req: UpdateTicketStatusRequest): Observable<void> {
    return this.patch<void>(`${id}/status`, req);
  }

  changePriority(id: string, req: UpdateTicketPriorityRequest): Observable<void> {
    return this.patch<void>(`${id}/priority`, req);
  }

  assignAgent(id: string, req: AssignTicketRequest): Observable<void> {
    return this.patch<void>(`${id}/assign`, req);
  }

  getComments(ticketId: string): Observable<CommentResponse[]> {
    return this.get<CommentResponse[]>(`${ticketId}/comments`);
  }

  addComment(ticketId: string, req: CreateCommentRequest): Observable<CommentResponse> {
    return this.post<CommentResponse>(`${ticketId}/comments`, req);
  }

  getActivities(ticketId: string): Observable<ActivityResponse[]> {
    return this.get<ActivityResponse[]>(`${ticketId}/activities`);
  }

  getTimeEntries(ticketId: string): Observable<TicketTimeEntriesResponse> {
    return this.get<TicketTimeEntriesResponse>(`${ticketId}/time-entries`);
  }

  addTimeEntry(ticketId: string, req: CreateTimeEntryRequest): Observable<TimeEntryResponse> {
    return this.post<TimeEntryResponse>(`${ticketId}/time-entries`, req);
  }
}
