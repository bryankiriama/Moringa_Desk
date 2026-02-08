import { apiClient } from "./client";
import type { FAQ, Tag, User } from "../types";

export type UserRoleUpdateRequest = {
  role: "student" | "admin";
};

export type TagCreateRequest = {
  name: string;
};

export type FAQCreateRequest = {
  question: string;
  answer: string;
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
