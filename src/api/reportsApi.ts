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
    blockId: number | null;
    blockLevelId: number | null;
    gpId: number | null;
    gpLevelId: number | null;
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

  // Determine the most specific boundary to use for the report
  let finalBoundaryId = decoded.BoundaryID;
  let finalBoundaryLevelId = decoded.BoundaryLevelID;

  if (filters.gpId && filters.gpLevelId) {
    finalBoundaryId = filters.gpId;
    finalBoundaryLevelId = filters.gpLevelId;
  } else if (filters.blockId && filters.blockLevelId) {
    finalBoundaryId = filters.blockId;
    finalBoundaryLevelId = filters.blockLevelId;
  }
  
  const payload = {
    UserID: decoded.UserID,
    BoundaryLevelID: finalBoundaryLevelId, 
    BoundaryID: finalBoundaryId,
    FromDate: filters.fromDate || null,
    ToDate: filters.toDate || null,
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


export interface Boundary {
  InnerBoundaryLevelID: number;
  InnerBoundaryID: number;
  InnerBoundaryName: string;
}


export const fetchBoundaryDetails = async (boundaryId: string, boundaryLevelId: string): Promise<Boundary[]> => {
  const token = Cookies.get('authToken');
  if (!token) throw new Error('Authentication token not found.');

  const decoded = decodeJwtToken(token);
  const userTypeID = decoded?.UserTypeID;
  if (!decoded || !decoded.UserID) {
    throw new Error('Invalid token: UserID is missing.');
  }

  const payload = {
    BoundaryID: boundaryId,
    BoundaryLevelID: boundaryLevelId,
    IsUrban: "0", // As per your example
    LoginUserID: decoded.UserID.toString(),
  };

  if (userTypeID !== 600) {
    const response = await fetch(`${BASE_URL}/get-boundary-details-by-boundary-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
   
    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
    const result = await response.json();
    if (result.status !== 0) throw new Error(result.message || "Failed to fetch boundary details.");
    
    return result.data || [];
  }


};