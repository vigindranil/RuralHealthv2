import Cookies from "js-cookie";
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3010/api";

export const getDataEntries = async () => {
    
  const token = Cookies.get("authToken");

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      IsMatriMaIdAvailable: "1",
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect, // Type assertion to fix lint error
    };

    const response = await fetch(
      `${BASE_URL}/get-all-hm-type`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data entries: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch data entries error:", error);
    return null;
  }
};

export interface MatriMaPayload {
  MatriMaRelatedInfoID: string;
  DistrictID: string;
  BlockID: string;
  GPID: string;
  VillageName: string;
  HealthCentreID: string;
  SubDivisionID: string;   // NEW
  MunicipalityID: string;  // NEW
  IsUrban: string;         // NEW  "0" = rural, "1" = urban
  ICDSCentreID: string;
  HMTypeID: string;
  MatriMaID: string;
  MotherName: string;
  MotherContactNo: string;
  FatherName: string;
  FatherContactNo: string;
  HusbandName: string;
  HusbandContactNo: string;
  ChildName: string;
  ChildID: string;
  ChildDOB: string;        // ISO yyyy-MM-dd
  ChildWeight: string;
  EntryUserID: string;
}

/* POST and return the server message */
export async function saveMatriMa(info: MatriMaPayload) {
  const token = Cookies.get('authToken') ?? '';
  const { data } = await axios.post(
    `${BASE_URL}/save-matrima-related-info`,
    info,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;    // { status, message, data: { … } }
}


// The parameters required for the API request body
interface ApiParams {
  HMTypeID: string;
  BoundaryLevelID: string;
  BoundaryID: string;
  UserID: string;
  FromDate: string;
  ToDate: string;
}

// The structure of a single record as it comes from the API (raw format)
// We export this so the component knows what kind of data to expect
export interface ApiResponseRecord {
  name: string;
  district: string;
  block: string;
  gramPanchayat: string;
  village: string;
  husbandName: string;
  phone: string;
  icdsCentreName: string;
  icdsCentreId: string;
  healthCentreName: string;
  healthCentreId: string;
}

export const getRawUnderageMarriageData = async (params: ApiParams) => {
  const API_URL = `${BASE_URL}/get-matrima-related-info`;
  const token = Cookies.get('authToken');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = await response.json();

  if (result.status !== 0) {
    throw new Error(result.message || "Failed to fetch valid data from the API.");
  }
  
  // Return the full result object instead of just records
  // This allows the component to access title, district, duration, etc.
  return result;
};

// GP Profile related interfaces and functions
export interface GpProfileData {
  GpProfileID: number;
  DistrictName: string;
  BlockName: string;
  GPID: number;
  GPName: string;
  GPAddress: string;
  ProdhanName: string;
  ProdhanContactNo: string;
  SecretaryName: string;
  SecretaryContactNo: string;
  ExecutiveName: string;
  ExecutiveContactNo: string;
  TotalPopulationQty: number;
  MalePopulationQty: number;
  FemalePopulationQty: number;
  TotalICDSCentreQty: number;
  TotalHealthCentreQty: number;
}

export interface GpProfileResponse {
  status: number;
  message: string;
  data: GpProfileData[];
}

export interface GpProfileFetchParams {
  BoundaryLevelID: string;
  BoundaryID: string;
  UserID: string;
  FromDate: null;
  ToDate: null;
}

export const getGpProfileInfo = async (params: GpProfileFetchParams): Promise<GpProfileResponse> => {
  const token = Cookies.get('authToken');

  if (!token) {
    throw new Error('Authentication token not found.');
  }

  const response = await fetch(`${BASE_URL}/get-gp-profile-info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GP profile: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.status !== 0) {
    throw new Error(result.message || 'Failed to fetch GP profile information.');
  }

  return result;
};

export interface GpProfilePayload {
  GPID: string | number;
  GPAddress: string;
  ProdhanName: string;
  ProdhanContactNo: string;
  SecretaryName: string;
  SecretaryContactNo: string;
  ExecutiveOfficerName: string;
  ExecutiveOfficerContactNo: string;
  TotalPopulationQty: number | string;
  MalePopulationQty: number | string;
  FemalePopulationQty: number | string;
  TotalICDSCentresQty: number | string;
  TotalHealthCentresQty: number | string;
  EntryUserID: string | number;
}

export const saveGpProfile = async (payload: GpProfilePayload) => {
  const token = Cookies.get('authToken');

  if (!token) {
    throw new Error('Authentication token not found.');
  }

  const response = await fetch(`${BASE_URL}/save-gp-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Try to get a meaningful error message from the backend
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return await response.json(); // Return the response data from the server
};

export interface NonMatriMaPayload {
  InHMID: string;
  DistrictID: string;
  SubDivisionID: string;
  IsUrban: string;
  MunicipalityID: string;
  BlockID: string;
  GPID: string;
  VillageName: string;
  HealthCentreID: string;
  ICDSCentreID: string;
  HMTypeID: string;
  EntryUserID: string;
  ContactNo?: string;
  InfectiousDiseaseID?: string;
  AffectedPersonName?: string;
  TBLeprosyPatientName?: string;
  NikshayMitra?: string; // "1" for Yes, "0" for No
  HusbandName?: string;
  GirlName?: string;
  GirlAge?: string | number;
  GirlWeight?: string | number;
  GirlFatherName?: string;
}

export async function saveNonMatriMa(info: NonMatriMaPayload) {
  const token = Cookies.get('authToken') ?? '';
  const { data } = await axios.post(
    `${BASE_URL}/save-non-matrima-related-info`,
    info,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data; 
}



export interface HealthCentrePayload {
  InHealthCentreID: string; // "0" for a new entry, or the ID for an update
  GPID: string;
  HealthCentreCodeNo: string;
  HealthCentreName: string;
  ANMName: string;
  ANMContactNo: string;
  CHOName: string;
  CHOContactNo: string;
  SCLocation: string;
  LandOwnerName: string;
  LandOwnerContactNo: string;
  LandOwnerAddress: string;
  OwnerShipTypeID: string; // "1" for OWN, "2" for RENTED, "3" for GOVT.
  IsExaminationRoomAvailable: string; // "1" for Yes, "0" for No
  IsLabRoomAvailable: string;
  IsMedicineStoreAvailable: string;
  IsWaitingAreaAvailable: string;
  IsToiletAvailable: string;
  IsPowerSupplyAvailable: string;
  IsWaterSupplyAvailable: string;
  IsInternetAvailable: string;
  Remarks: string;
  EntryUserID: string;
}


export const saveHealthCentreInfo = async (payload: HealthCentrePayload) => {
  const token = Cookies.get('authToken');
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const { data } = await axios.post(
      `${BASE_URL}/save-health-centre-info`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
     
      throw new Error(error.response.data.message || 'An API error occurred while saving.');
    }
    // Fallback for network errors or other issues
    throw new Error('A network error occurred. Please try again.');
  }
};



export interface ICDSPayload {
  InICDSCentreID: string;
  GPID: string;
  AWCNo: string;
  AWCName: string;
  VillageName: string;
  AWWName: string;
  AWWContactNo: string;
  AWHName: string;
  AWHContactNo: string;
  AWCLocation: string;
  AWCLocationContactNo: string;
  LandOwnerName: string;
  LandOwnerContactNo: string;
  OwnerShipTypeID: string;
  IsKitchenAvailable: string;
  IsStoreRoomAvailable: string;
  IsToiletAvailable: string;
  Remarks: string;
  EntryUserID: string;
}

// --- API Function ---
export const saveICDSCentreInfo = async (payload: ICDSPayload) => {
  const token = Cookies.get('authToken');
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const { data } = await axios.post(
      `${BASE_URL}/save-icds-centre-info`, // MODIFIED: URL endpoint
      payload,                            // The payload with ICDS data
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    // The API returns a response like { status: 0, message: "..." }
    // We return the whole data object so the component can check the status and message.
    return data;
  } catch (error) {
    // This provides detailed error messages back to the component.
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An API error occurred while saving.');
    }
    // Fallback for network errors or other issues not from the API response
    throw new Error('A network error occurred. Please try again.');
  }
};