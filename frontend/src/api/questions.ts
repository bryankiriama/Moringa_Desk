import { apiClient } from "./client";
import type { Question, QuestionDetail, Tag } from "../types";

export type QuestionCreateRequest = {
  title: string;
  body: string;
  category: string;
  stage: string;
};

export type QuestionListParams = {
  limit?: number;
  offset?: number;
  tag?: string;
  category?: string;
  stage?: string;
  q?: string;
};

export const listQuestions = async (params?: QuestionListParams): Promise<Question[]> => {
  const response = await apiClient.get<Question[]>("/questions", { params });
  return response.data;
};

export const getQuestionDetail = async (
  questionId: string
): Promise<QuestionDetail> => {
  const response = await apiClient.get<QuestionDetail>(`/questions/${questionId}`);
  return response.data;
};

export const createQuestion = async (
  payload: QuestionCreateRequest
): Promise<Question> => {
  const response = await apiClient.post<Question>("/questions", payload);
  return response.data;
};

// TODO: Implement API calls
export const listDuplicateQuestions = async (_title: string): Promise<Question[]> => {
  throw new Error("Not implemented");
};

export const listTags = async (): Promise<Tag[]> => {
  throw new Error("Not implemented");
};

export const createTag = async (_name: string): Promise<Tag> => {
  throw new Error("Not implemented");
};

export const attachTagsToQuestion = async (
  _questionId: string,
  _tagIds: string[]
): Promise<Tag[]> => {
  throw new Error("Not implemented");
};
