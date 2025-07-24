import Cookies from "js-cookie";
import axios from 'axios';
import Cookies from 'js-cookie';

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
      "http://localhost:3010/api/get-all-hm-type",
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
    'http://localhost:3010/api/save-matrima-related-info',
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


export const getRawUnderageMarriageData = async (params: ApiParams): Promise<ApiResponseRecord[]> => {
  const API_URL = 'http://localhost:3010/api/get-matrima-related-info';
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

  if (result.status !== 0 || !result.data || !result.data.records) {
    throw new Error(result.message || "Failed to fetch valid data from the API.");
  }
  
  
  return result.data.records;
};