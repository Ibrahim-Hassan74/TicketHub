export interface TimeEntryResponse {
  id: string;
  ticketId: string;
  agentId: string;
  agentName: string;
  workDate: string;
  durationMinutes: number;
  description: string;
  createdAt: string;
}

export interface CreateTimeEntryRequest {
  workDate: string;
  durationMinutes: number;
  description: string;
}

export interface TicketTimeEntriesResponse {
  totalDurationMinutes: number;
  entries: TimeEntryResponse[];
}
