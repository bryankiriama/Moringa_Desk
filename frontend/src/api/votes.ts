import { apiClient } from "./client";

export type VoteCreateRequest = {
  target_type: "question" | "answer";
  target_id: string;
  value: 1 | -1;
};

export type VoteResponse = {
  id: string;
  user_id: string;
  target_type: string;
  target_id: string;
  value: number;
  created_at: string;
};

export const castVote = async (payload: VoteCreateRequest): Promise<VoteResponse> => {
  const response = await apiClient.post<VoteResponse>("/votes", payload);
  return response.data;
};
