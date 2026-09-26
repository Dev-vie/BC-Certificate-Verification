import { api } from "../auth/authAPI";
import type { DashboardResponse } from "./dashboardTypes";

export const dashboardAPI = {
  getDashboard: () =>
    api.get<DashboardResponse>("/dashboard").then((res) => res.data.dashboard),
};
