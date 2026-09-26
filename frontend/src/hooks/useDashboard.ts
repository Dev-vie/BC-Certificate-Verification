import { useEffect, useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../redux/features/dashboard/index";
import {
  fetchDashboardStats,
  clearDashboardError,
} from "../redux/features/dashboard/dashbaordSlice";

export function useDashboard() {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.dashboard);

  const refresh = useCallback(
    () => dispatch(fetchDashboardStats()),
    [dispatch],
  );

  const clearError = useCallback(
    () => dispatch(clearDashboardError()),
    [dispatch],
  );

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { stats, loading, error, refresh, clearError };
}
