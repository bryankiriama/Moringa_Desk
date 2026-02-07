export interface Question {
  id: string;
  author_id: string;
  title: string;
  body: string;
  category: string;
  stage: string;
  accepted_answer_id: string | null;
  created_at: string;
  updated_at: string;
  vote_score: number;
}
