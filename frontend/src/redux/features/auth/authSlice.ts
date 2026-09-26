import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authAPI } from "./authAPI";
import type {
  AuthState,
  RegisterPayload,
  VerifyEmailPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyResetCodePayload,
  ResetPasswordPayload,
} from "./authTypes";

const tokenFromStorage = localStorage.getItem("token");
const isAuthFromStorage =
  localStorage.getItem("isAuthenticated") === "true" || Boolean(tokenFromStorage);
const institutionFromStorage = (() => {
  const saved = localStorage.getItem("institution");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return null;
})();

const initialState: AuthState = {
  institution: institutionFromStorage,
  token: tokenFromStorage,
  isAuthenticated: isAuthFromStorage,
  loading: false,
  error: null,
  message: null,
};

function saveInstitution(inst: AuthState["institution"]) {
  if (inst) {
    localStorage.setItem("institution", JSON.stringify(inst));
  } else {
    localStorage.removeItem("institution");
  }
}

function extractError(err: unknown): string {
  const anyErr = err as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return (
    anyErr?.response?.data?.message || anyErr?.message || "Something went wrong"
  );
}

export const registerInstitution = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authAPI.register(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (payload: VerifyEmailPayload, { rejectWithValue }) => {
    try {
      return await authAPI.verifyEmail(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authAPI.login(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload: ForgotPasswordPayload, { rejectWithValue }) => {
    try {
      return await authAPI.forgotPassword(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const verifyResetCode = createAsyncThunk(
  "auth/verifyResetCode",
  async (payload: VerifyResetCodePayload, { rejectWithValue }) => {
    try {
      return await authAPI.verifyResetCode(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      return await authAPI.resetPassword(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await authAPI.getProfile();
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    payload: { name?: string; email?: string; avatar?: string | null },
    { rejectWithValue },
  ) => {
    try {
      return await authAPI.updateProfile(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginWithGoogleSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        institution: AuthState["institution"];
      }>,
    ) => {
      state.loading = false;
      state.error = null;
      state.institution = action.payload.institution;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("isAuthenticated", "true");
      saveInstitution(action.payload.institution);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
      localStorage.setItem("isAuthenticated", "true");
    },
    logout: (state) => {
      state.institution = null;
      state.token = null;
      state.isAuthenticated = false;
      state.message = null;
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("institution");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.institution = action.payload.institution;
        saveInstitution(action.payload.institution);
      })

      // update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.institution = action.payload.institution;
        saveInstitution(action.payload.institution);
      })

      // register
      .addCase(registerInstitution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerInstitution.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(
        registerInstitution.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )

      // verify email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.institution = action.payload.institution;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("isAuthenticated", "true");
        saveInstitution(action.payload.institution);
      })
      .addCase(
        verifyEmail.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.institution = action.payload.institution;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("isAuthenticated", "true");
        saveInstitution(action.payload.institution);
      })
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(
        forgotPassword.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )

      // verify reset code
      .addCase(verifyResetCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(
        verifyResetCode.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )

      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(
        resetPassword.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const {
  setToken,
  logout,
  clearAuthError,
  clearAuthMessage,
  loginWithGoogleSuccess,
} = authSlice.actions;
export default authSlice.reducer;
