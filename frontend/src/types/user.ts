export type UserRole = "student" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  questions_count: number;
  answers_count: number;
  created_at: string;
  updated_at: string | null;
}
