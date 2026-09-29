import { api } from "../auth/authAPI";
import type { DashboardResponse } from "./dashboardTypes";
import { getMockDashboardStats } from "../../../data/mockStore";

export const dashboardAPI = {
  getDashboard: async () => {
    try {
      const res = await api.get<DashboardResponse>("/dashboard");
      return res.data.dashboard;
    } catch {
      return getMockDashboardStats();
    }
  },
};
