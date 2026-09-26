import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { dashboardAPI } from "./dashboardAPI";
import type { DashboardState, DashboardStats } from "./dashboardTypes";

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

function extractError(err: unknown): string {
  const anyErr = err as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return (
    anyErr?.response?.data?.message || anyErr?.message || "Something went wrong"
  );
}

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_: void, { rejectWithValue }) => {
    try {
      return await dashboardAPI.getDashboard();
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.loading = false;
          state.stats = action.payload;
        },
      )
      .addCase(
        fetchDashboardStats.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      );
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
