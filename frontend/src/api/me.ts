import { apiClient } from "./client";
import type { MyAnswer, MyQuestion } from "../types";

export const listMyQuestions = async (): Promise<MyQuestion[]> => {
  const response = await apiClient.get<MyQuestion[]>("/me/questions");
  return response.data;
};

export const listMyAnswers = async (): Promise<MyAnswer[]> => {
  const response = await apiClient.get<MyAnswer[]>("/me/answers");
  return response.data;
};
