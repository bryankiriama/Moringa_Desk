import type { FAQ, User } from "../types";

export type UserRoleUpdateRequest = {
  role: "student" | "admin";
};

export type FAQCreateRequest = {
  question: string;
  answer: string;
};

// TODO: Implement API calls
export const listUsers = async (): Promise<User[]> => {
  throw new Error("Not implemented");
};

export const updateUserRole = async (
  _userId: string,
  _payload: UserRoleUpdateRequest
): Promise<User> => {
  throw new Error("Not implemented");
};

export const listFaqs = async (): Promise<FAQ[]> => {
  throw new Error("Not implemented");
};

export const createFaq = async (_payload: FAQCreateRequest): Promise<FAQ> => {
  throw new Error("Not implemented");
};
