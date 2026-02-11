export interface Question {
  id: string;
  author_id: string;
  author_name?: string | null;
  title: string;
  body: string;
  category: string;
  stage: string;
  accepted_answer_id: string | null;
  created_at: string;
  updated_at: string;
  answers_count?: number;
  views_count?: number;
  vote_score: number;
}

export interface QuestionDetail extends Question {
  answers: import("./answer").Answer[];
  tags: import("./tag").Tag[];
  related_questions: Question[];
}
