import { apiClient } from "./client";
import type { Notification } from "../types";

// TODO: Implement API calls
export const listNotifications = async (
  unreadOnly?: boolean
): Promise<Notification[]> => {
  const params =
    typeof unreadOnly === "boolean" ? { unread_only: unreadOnly } : undefined;
  const response = await apiClient.get<Notification[]>("/notifications", {
    params,
  });
  return response.data;
};

export const markAllRead = async (): Promise<{ updated: number }> => {
  const response = await apiClient.post<{ updated: number }>(
    "/notifications/mark-all-read"
  );
  return response.data;
};
