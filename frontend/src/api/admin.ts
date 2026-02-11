import { apiClient } from "./client";
import type { FAQ, Flag, Tag, User } from "../types";

export type UserRoleUpdateRequest = {
  role: "student" | "admin";
};

export type TagCreateRequest = {
  name: string;
};

export type FAQCreateRequest = {
  question: string;
  answer: string;
  category?: string | null;
};

export type FAQUpdateRequest = {
  question?: string;
  answer?: string;
  category?: string | null;
};

export const listUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>("/admin/users");
  return response.data;
};

export const updateUserRole = async (
  userId: string,
  payload: UserRoleUpdateRequest
): Promise<User> => {
  const response = await apiClient.patch<User>(`/admin/users/${userId}`, payload);
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}`);
};

export const listTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get<Tag[]>("/tags");
  return response.data;
};

export const createTag = async (payload: TagCreateRequest): Promise<Tag> => {
  const response = await apiClient.post<Tag>("/tags", payload);
  return response.data;
};

export const listFaqs = async (): Promise<FAQ[]> => {
  const response = await apiClient.get<FAQ[]>("/faqs");
  return response.data;
};

export const createFaq = async (payload: FAQCreateRequest): Promise<FAQ> => {
  const response = await apiClient.post<FAQ>("/faqs", payload);
  return response.data;
};

export const updateFaq = async (
  faqId: string,
  payload: FAQUpdateRequest
): Promise<FAQ> => {
  const response = await apiClient.patch<FAQ>(`/faqs/${faqId}`, payload);
  return response.data;
};

export const deleteFaq = async (faqId: string): Promise<void> => {
  await apiClient.delete(`/faqs/${faqId}`);
};

export const listFlags = async (): Promise<Flag[]> => {
  const response = await apiClient.get<Flag[]>("/flags");
  return response.data;
};

export const deleteFlag = async (flagId: string): Promise<void> => {
  await apiClient.delete(`/flags/${flagId}`);
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  await apiClient.delete(`/admin/content/questions/${questionId}`);
};

export const deleteAnswer = async (answerId: string): Promise<void> => {
  await apiClient.delete(`/admin/content/answers/${answerId}`);
};

export type QuestionAdminUpdateRequest = {
  title?: string;
  body?: string;
  category?: string;
  stage?: string;
};

export type AnswerAdminUpdateRequest = {
  body: string;
};

export const updateQuestionContent = async (
  questionId: string,
  payload: QuestionAdminUpdateRequest
) => {
  const response = await apiClient.patch(`/admin/content/questions/${questionId}`, payload);
  return response.data;
};

export const updateAnswerContent = async (
  answerId: string,
  payload: AnswerAdminUpdateRequest
) => {
  const response = await apiClient.patch(`/admin/content/answers/${answerId}`, payload);
  return response.data;
};
