import type { Question, Tag } from "../types";

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

// TODO: Implement API calls
export const listQuestions = async (_params?: QuestionListParams): Promise<Question[]> => {
  throw new Error("Not implemented");
};

export const getQuestion = async (_questionId: string): Promise<Question> => {
  throw new Error("Not implemented");
};

export const createQuestion = async (
  _payload: QuestionCreateRequest
): Promise<Question> => {
  throw new Error("Not implemented");
};

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
