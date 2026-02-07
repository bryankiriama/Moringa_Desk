import type { Notification } from "../types";

// TODO: Implement API calls
export const listNotifications = async (
  _unreadOnly?: boolean
): Promise<Notification[]> => {
  throw new Error("Not implemented");
};

export const markAllRead = async (): Promise<{ updated: number }> => {
  throw new Error("Not implemented");
};
