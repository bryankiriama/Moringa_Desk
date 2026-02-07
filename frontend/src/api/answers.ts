import type { Answer } from "../types";

export type AnswerCreateRequest = {
  body: string;
};

// TODO: Implement API calls
export const listAnswers = async (_questionId: string): Promise<Answer[]> => {
  throw new Error("Not implemented");
};

export const createAnswer = async (
  _questionId: string,
  _payload: AnswerCreateRequest
): Promise<Answer> => {
  throw new Error("Not implemented");
};

export const acceptAnswer = async (
  _questionId: string,
  _answerId: string
): Promise<void> => {
  throw new Error("Not implemented");
};
