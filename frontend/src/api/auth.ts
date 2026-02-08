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
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
  role?: "student" | "admin";
};

export type ForgotPasswordRequest = {
  email: string;
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

// TODO: Implement API calls
export const forgotPassword = async (_payload: ForgotPasswordRequest): Promise<void> => {
  throw new Error("Not implemented");
};

export const resetPassword = async (_payload: ResetPasswordRequest): Promise<void> => {
  throw new Error("Not implemented");
};

export const getCurrentUser = async (): Promise<User> => {
  throw new Error("Not implemented");
};
