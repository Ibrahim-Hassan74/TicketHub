import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ResourceService } from './resource.service';
import { UserResponse, AgentSummary, UserQueryRequest } from '../../shared/models/user';
import { PaginatedResponse } from '../../shared/models/api';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ResourceService<UserResponse> {
  constructor() {
    super('Users');
  }

  getAgents(): Observable<AgentSummary[]> {
    return this.get<PaginatedResponse<AgentSummary>>('agents').pipe(
      map(res => res.items)
    );
  }

  create(user: any): Observable<UserResponse> {
    return this.post<UserResponse>('', user);
  }

  update(id: string, user: any): Observable<UserResponse> {
    return this.put<UserResponse>(id, user);
  }

  getUsers(query: UserQueryRequest): Observable<PaginatedResponse<UserResponse>> {
    let params = new HttpParams();
    if (query.role) params = params.set('role', query.role);
    if (query.search) params = params.set('search', query.search);
    if (query.page) params = params.set('page', query.page.toString());
    if (query.pageSize) params = params.set('pageSize', query.pageSize.toString());

    return this.get<PaginatedResponse<UserResponse>>('', { params });
  }
}
