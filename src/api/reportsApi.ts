import Cookies from "js-cookie";
import { decodeJwtToken } from "../utils/decodetoken";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3010/api";


export interface GpProfileReportParams {
  BoundaryLevelID: string;
  BoundaryID: string;
  UserID: string;
  FromDate: string | null;
  ToDate: string | null;
}



export interface GpProfileReportData {
  filters: {
    year: string;
    month: string;
    block: string;
    gp: string;
  };
  health_metrics_overview: {
    [key: string]: number; // e.g., Childbirths_Last_Month_NonInstitutional: 45
  };
  sections: {
    [key: string]: any[]; // e.g., childbirths_last_month: [...]
  };
}




export interface ReportFilters {
    fromDate: string | null;
    toDate: string | null;
    block: string;
    gp: string;
}

/**
 * Defines the structure of the data object returned by the API call.
 * This interface remains unchanged.
 */
export interface GpProfileReportData {
  filters: {
    year: string;
    month: string;
    block: string;
    gp: string;
  };
  health_metrics_overview: {
    [key: string]: number;
  };
  sections: {
    [key: string]: any[];
  };
}

/**
 * Fetches the GP Profile Report.
 * It takes date filters from the component and combines them with
 * UserID, BoundaryID, and BoundaryLevelID from the auth token to create the final payload.
 */
export const fetchGpProfileReport = async (filters: ReportFilters): Promise<GpProfileReportData> => {
  const token = Cookies.get('authToken');
  if (!token) throw new Error('Authentication token not found. Please log in.');

  const decoded = decodeJwtToken(token);
  if (!decoded || !decoded.UserID || !decoded.BoundaryLevelID || !decoded.BoundaryID) {
    throw new Error('Invalid token: Required user or boundary information is missing.');
  }

  // **KEY FIX**: This payload now correctly includes FromDate and ToDate from the filters.
  const payload = {
    UserID: decoded.UserID,
    BoundaryLevelID: decoded.BoundaryLevelID, 
    BoundaryID: decoded.BoundaryID,
    FromDate: filters.fromDate, // This will be passed from the component state
    ToDate: filters.toDate,     // This will also be passed from the component state
  };

  const response = await fetch(`${BASE_URL}/get-gp-profile-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
  const result = await response.json();
  if (result.status !== 0) throw new Error(result.message || "Failed to fetch a valid report.");
  
  return result.data;
};