export interface MyQuestion {
  id: string;
  author_id: string;
  title: string;
  body: string;
  category: string;
  stage: string;
  accepted_answer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MyAnswer {
  id: string;
  question_id: string;
  author_id: string;
  body: string;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
}
