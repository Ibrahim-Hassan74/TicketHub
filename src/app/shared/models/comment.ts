export interface CommentResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}
