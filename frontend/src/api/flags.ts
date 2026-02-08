import { apiClient } from "./client";

export type FlagCreateRequest = {
  target_type: "question" | "answer";
  target_id: string;
  reason: string;
};

export type FlagResponse = {
  id: string;
  user_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  created_at: string;
};

export const createFlag = async (payload: FlagCreateRequest): Promise<FlagResponse> => {
  const response = await apiClient.post<FlagResponse>("/flags", payload);
  return response.data;
};
