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

const getViewSessionId = (): string => {
  try {
    const existing = sessionStorage.getItem("md_view_session");
    if (existing) return existing;
    const value = crypto.randomUUID();
    sessionStorage.setItem("md_view_session", value);
    return value;
  } catch {
    return "anon-session";
  }
};

const hasViewedQuestion = (questionId: string): boolean => {
  try {
    return sessionStorage.getItem(`md_viewed_${questionId}`) === "1";
  } catch {
    return false;
  }
};

const markViewedQuestion = (questionId: string) => {
  try {
    sessionStorage.setItem(`md_viewed_${questionId}`, "1");
  } catch {
    // ignore
  }
};

export const getQuestionDetail = async (
  questionId: string
): Promise<QuestionDetail> => {
  const alreadyViewed = hasViewedQuestion(questionId);
  const response = await apiClient.get<QuestionDetail>(
    `/questions/${questionId}`,
    {
      params: { track_view: !alreadyViewed },
      headers: { "X-View-Session": getViewSessionId() },
    }
  );
  if (!alreadyViewed) {
    markViewedQuestion(questionId);
  }
  return response.data;
};

export const createQuestion = async (
  payload: QuestionCreateRequest
): Promise<Question> => {
  const response = await apiClient.post<Question>("/questions", payload);
  return response.data;
};

export const listDuplicateQuestions = async (title: string): Promise<Question[]> => {
  const response = await apiClient.get<Question[]>("/questions/duplicates", {
    params: { title },
  });
  return response.data;
};

export const listTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get<Tag[]>("/tags");
  return response.data;
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
