import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";
import type { FAQ, Tag, User } from "../../types";
import {
  createFaq,
  createTag,
  deleteFaq,
  deleteUser,
  listFaqs,
  listTags,
  listUsers,
  updateFaq,
  updateUserRole,
  type FAQCreateRequest,
  type FAQUpdateRequest,
  type TagCreateRequest,
  type UserRoleUpdateRequest,
} from "../../api/admin";

type LoadStatus = "idle" | "loading" | "succeeded" | "failed";

type AdminState = {
  users: User[];
  usersStatus: LoadStatus;
  usersError: string | null;
  updateRoleStatus: LoadStatus;
  updateRoleError: string | null;
  deleteUserStatus: LoadStatus;
  deleteUserError: string | null;
  tags: Tag[];
  tagsStatus: LoadStatus;
  tagsError: string | null;
  createTagStatus: LoadStatus;
  createTagError: string | null;
  faqs: FAQ[];
  faqsStatus: LoadStatus;
  faqsError: string | null;
  createFaqStatus: LoadStatus;
  createFaqError: string | null;
  updateFaqStatus: LoadStatus;
  updateFaqError: string | null;
  deleteFaqStatus: LoadStatus;
  deleteFaqError: string | null;
};

const initialState: AdminState = {
  users: [],
  usersStatus: "idle",
  usersError: null,
  updateRoleStatus: "idle",
  updateRoleError: null,
  deleteUserStatus: "idle",
  deleteUserError: null,
  tags: [],
  tagsStatus: "idle",
  tagsError: null,
  createTagStatus: "idle",
  createTagError: null,
  faqs: [],
  faqsStatus: "idle",
  faqsError: null,
  createFaqStatus: "idle",
  createFaqError: null,
  updateFaqStatus: "idle",
  updateFaqError: null,
  deleteFaqStatus: "idle",
  deleteFaqError: null,
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};

export const fetchAdminUsers = createAsyncThunk(
  "admin/users/list",
  async (_, { rejectWithValue }) => {
    try {
      return await listUsers();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUserRoleItem = createAsyncThunk(
  "admin/users/updateRole",
  async (
    payload: { userId: string; data: UserRoleUpdateRequest },
    { rejectWithValue }
  ) => {
    try {
      return await updateUserRole(payload.userId, payload.data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteUserItem = createAsyncThunk(
  "admin/users/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      await deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAdminTags = createAsyncThunk(
  "admin/tags/list",
  async (_, { rejectWithValue }) => {
    try {
      return await listTags();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createTagItem = createAsyncThunk(
  "admin/tags/create",
  async (payload: TagCreateRequest, { rejectWithValue }) => {
    try {
      return await createTag(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAdminFaqs = createAsyncThunk(
  "admin/faqs/list",
  async (_, { rejectWithValue }) => {
    try {
      return await listFaqs();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createFaqItem = createAsyncThunk(
  "admin/faqs/create",
  async (payload: FAQCreateRequest, { rejectWithValue }) => {
    try {
      return await createFaq(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateFaqItem = createAsyncThunk(
  "admin/faqs/update",
  async (
    payload: { faqId: string; data: FAQUpdateRequest },
    { rejectWithValue }
  ) => {
    try {
      return await updateFaq(payload.faqId, payload.data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteFaqItem = createAsyncThunk(
  "admin/faqs/delete",
  async (faqId: string, { rejectWithValue }) => {
    try {
      await deleteFaq(faqId);
      return faqId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersStatus = "loading";
        state.usersError = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.usersError = (action.payload as string) ?? "Failed to load users";
      })
      .addCase(updateUserRoleItem.pending, (state) => {
        state.updateRoleStatus = "loading";
        state.updateRoleError = null;
      })
      .addCase(updateUserRoleItem.fulfilled, (state, action) => {
        state.updateRoleStatus = "succeeded";
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUserRoleItem.rejected, (state, action) => {
        state.updateRoleStatus = "failed";
        state.updateRoleError =
          (action.payload as string) ?? "Failed to update role";
      })
      .addCase(deleteUserItem.pending, (state) => {
        state.deleteUserStatus = "loading";
        state.deleteUserError = null;
      })
      .addCase(deleteUserItem.fulfilled, (state, action) => {
        state.deleteUserStatus = "succeeded";
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUserItem.rejected, (state, action) => {
        state.deleteUserStatus = "failed";
        state.deleteUserError =
          (action.payload as string) ?? "Failed to delete user";
      })
      .addCase(fetchAdminTags.pending, (state) => {
        state.tagsStatus = "loading";
        state.tagsError = null;
      })
      .addCase(fetchAdminTags.fulfilled, (state, action) => {
        state.tagsStatus = "succeeded";
        state.tags = action.payload;
      })
      .addCase(fetchAdminTags.rejected, (state, action) => {
        state.tagsStatus = "failed";
        state.tagsError = (action.payload as string) ?? "Failed to load tags";
      })
      .addCase(createTagItem.pending, (state) => {
        state.createTagStatus = "loading";
        state.createTagError = null;
      })
      .addCase(createTagItem.fulfilled, (state, action) => {
        state.createTagStatus = "succeeded";
        state.tags = [action.payload, ...state.tags];
      })
      .addCase(createTagItem.rejected, (state, action) => {
        state.createTagStatus = "failed";
        state.createTagError =
          (action.payload as string) ?? "Failed to create tag";
      })
      .addCase(fetchAdminFaqs.pending, (state) => {
        state.faqsStatus = "loading";
        state.faqsError = null;
      })
      .addCase(fetchAdminFaqs.fulfilled, (state, action) => {
        state.faqsStatus = "succeeded";
        state.faqs = action.payload;
      })
      .addCase(fetchAdminFaqs.rejected, (state, action) => {
        state.faqsStatus = "failed";
        state.faqsError = (action.payload as string) ?? "Failed to load FAQs";
      })
      .addCase(createFaqItem.pending, (state) => {
        state.createFaqStatus = "loading";
        state.createFaqError = null;
      })
      .addCase(createFaqItem.fulfilled, (state, action) => {
        state.createFaqStatus = "succeeded";
        state.faqs = [action.payload, ...state.faqs];
      })
      .addCase(createFaqItem.rejected, (state, action) => {
        state.createFaqStatus = "failed";
        state.createFaqError =
          (action.payload as string) ?? "Failed to create FAQ";
      })
      .addCase(updateFaqItem.pending, (state) => {
        state.updateFaqStatus = "loading";
        state.updateFaqError = null;
      })
      .addCase(updateFaqItem.fulfilled, (state, action) => {
        state.updateFaqStatus = "succeeded";
        state.faqs = state.faqs.map((faq) =>
          faq.id === action.payload.id ? action.payload : faq
        );
      })
      .addCase(updateFaqItem.rejected, (state, action) => {
        state.updateFaqStatus = "failed";
        state.updateFaqError =
          (action.payload as string) ?? "Failed to update FAQ";
      })
      .addCase(deleteFaqItem.pending, (state) => {
        state.deleteFaqStatus = "loading";
        state.deleteFaqError = null;
      })
      .addCase(deleteFaqItem.fulfilled, (state, action) => {
        state.deleteFaqStatus = "succeeded";
        state.faqs = state.faqs.filter((faq) => faq.id !== action.payload);
      })
      .addCase(deleteFaqItem.rejected, (state, action) => {
        state.deleteFaqStatus = "failed";
        state.deleteFaqError =
          (action.payload as string) ?? "Failed to delete FAQ";
      });
  },
});

export const selectAdmin = (state: RootState) => state.admin;
export default adminSlice.reducer;
