import type { DashboardStats } from "../../types/dashboard/dashboardStats";

export function useDashboard() {
  const getStats = () =>
    useFetch<DashboardStats>("/api/dashboard/dashboard", {
      transform: (stats) => ({
        artworks: stats?.artworks ?? 0,
        posts: stats?.posts ?? 0,
        orders: stats?.orders ?? 0,
      }),
    });

  return { getStats };
}
