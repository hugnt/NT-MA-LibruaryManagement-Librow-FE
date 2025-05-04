import { httpClient } from "@/lib/httpClient";
import { DashboardModel } from "@/types/Dashboard";

const dashboardService = {
    getSummaryInfo: () => httpClient.get<DashboardModel[]>(`dashboard/summary-info`),
    getPopularBooks: (top: number = 5) => httpClient.get<DashboardModel[]>(`dashboard/popular-books?top=${top}`),
    getRequestAnalysis: () => httpClient.get<DashboardModel[]>(`dashboard/request-analysis`),
};

export default dashboardService;