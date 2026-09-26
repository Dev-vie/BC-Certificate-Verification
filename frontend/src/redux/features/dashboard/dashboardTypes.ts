export interface DashboardStats {
  totalIssued: number;
  totalIssuedChangePercent: number;
  verifiedToday: number;
  verifiedTodayChangeCount: number;
  activeRecipients: number;
  activeProgramsCount: number;
  verificationRate: number;
}

export interface DashboardResponse {
  dashboard: DashboardStats;
}

export interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}
