export interface Notification {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}
