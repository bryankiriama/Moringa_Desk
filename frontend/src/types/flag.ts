export interface Flag {
  id: string;
  user_id: string;
  target_type: "question" | "answer";
  target_id: string;
  reason: string;
  created_at: string;
}
