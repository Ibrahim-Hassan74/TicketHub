export interface DashboardStatsResponse {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  criticalOpenTickets: number;
  avgResolutionTimeHours: number;
}

export interface AgentWorkloadResponse {
  agentId: string;
  agentName: string;
  openTickets: number;
  inProgressTickets: number;
  totalTimeMinutes: number;
}

export interface TicketTrendResponse {
  date: string;
  openCount: number;
  closedCount: number;
}
