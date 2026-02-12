import { apiClient } from "./client";
import type { User } from "../types";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  full_name: string;
  password: string;
  role: "student" | "admin";
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
  role?: "student" | "admin";
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  detail: string;
  email_exists: boolean;
  reset_token: string | null;
};

export type ResetPasswordRequest = {
  token: string;
  new_password: string;
};

export const login = async (payload: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>("/auth/login", payload);
  return response.data;
};

export const register = async (payload: RegisterRequest): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>("/auth/register", payload);
  return response.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    payload
  );
  return response.data;
};

export const resetPassword = async (payload: ResetPasswordRequest): Promise<void> => {
  await apiClient.post("/auth/reset-password", payload);
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/me/profile");
  return response.data;
};
