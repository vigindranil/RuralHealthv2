import Cookies from 'js-cookie';
import { DashboardResponse } from '../types/dashboard';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3010/api";

export const fetchDashboardData = async (
  boundaryLevelID: string,
  boundaryID: string,
  userID: string,
  fromDate: string,
  toDate: string
): Promise<DashboardResponse> => {
  const token = Cookies.get('authToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${BASE_URL}/get-dashboard-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      BoundaryLevelID: boundaryLevelID,
      BoundaryID: boundaryID,
      UserID: userID,
      FromDate: fromDate || null,
      ToDate: toDate || null,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: DashboardResponse = await response.json();
  
  if (data.status !== 0) {
    throw new Error(data.message || 'Failed to fetch dashboard data');
  }

  return data;
};

export interface MonthDateRange {
  month: string;
  year: number;
  fromDate: string;
  toDate: string;
}


export const fetchMonthlyDateRanges = async (year: number): Promise<MonthDateRange[]> => {
  const token = Cookies.get("authToken");
  // The endpoint and request body should match your API specification
  const response = await fetch(`${BASE_URL}/get-monthly-date-ranges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ year })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch monthly date ranges');
  }

  const result = await response.json();
  if (result.status !== 0) {
     throw new Error(result.message || 'Failed to fetch date ranges');
  }
  return result.data;
};