import { apiClient } from "./client";
import type { Question } from "../types";

export const followQuestion = async (questionId: string): Promise<void> => {
  await apiClient.post(`/questions/${questionId}/follow`);
};

export const unfollowQuestion = async (questionId: string): Promise<void> => {
  await apiClient.delete(`/questions/${questionId}/follow`);
};

export const listMyFollows = async (): Promise<Question[]> => {
  const response = await apiClient.get<Question[]>("/me/follows");
  return response.data;
};
