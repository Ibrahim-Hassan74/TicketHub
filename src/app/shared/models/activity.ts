export interface ActivityResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  type: string;
  description: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}
