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
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  new_password: string;
};

// TODO: Implement API calls
export const login = async (_payload: LoginRequest): Promise<TokenResponse> => {
  throw new Error("Not implemented");
};

export const register = async (_payload: RegisterRequest): Promise<TokenResponse> => {
  throw new Error("Not implemented");
};

export const forgotPassword = async (_payload: ForgotPasswordRequest): Promise<void> => {
  throw new Error("Not implemented");
};

export const resetPassword = async (_payload: ResetPasswordRequest): Promise<void> => {
  throw new Error("Not implemented");
};

export const getCurrentUser = async (): Promise<User> => {
  throw new Error("Not implemented");
};
