export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
