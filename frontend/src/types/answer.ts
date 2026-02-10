export interface Answer {
  id: string;
  question_id: string;
  author_id: string;
  author_name?: string | null;
  body: string;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
  vote_score: number;
}
