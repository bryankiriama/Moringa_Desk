import { apiClient } from "./client";
import type { Answer } from "../types";

export type AnswerCreateRequest = {
  body: string;
};

// TODO: Implement API calls
export const listAnswers = async (questionId: string): Promise<Answer[]> => {
  const response = await apiClient.get<Answer[]>(
    `/questions/${questionId}/answers`
  );
  return response.data;
};

export const createAnswer = async (
  questionId: string,
  payload: AnswerCreateRequest
): Promise<Answer> => {
  const response = await apiClient.post<Answer>(
    `/questions/${questionId}/answers`,
    payload
  );
  return response.data;
};

export const acceptAnswer = async (
  questionId: string,
  answerId: string
): Promise<void> => {
  await apiClient.post(`/questions/${questionId}/answers/${answerId}/accept`);
};
