import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceService } from './resource.service';
import { AgentWorkloadResponse, DashboardStatsResponse, TicketTrendResponse } from '../../shared/models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ResourceService {
  constructor() {
    super('Dashboard');
  }

  getStats(): Observable<DashboardStatsResponse> {
    return this.get<DashboardStatsResponse>('stats');
  }

  getAgentWorkload(): Observable<AgentWorkloadResponse[]> {
    return this.get<AgentWorkloadResponse[]>('agent-workload');
  }

  getTicketTrends(days: number = 30): Observable<TicketTrendResponse[]> {
    return this.get<TicketTrendResponse[]>('ticket-trends', { params: { days } });
  }
}
