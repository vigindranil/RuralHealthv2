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