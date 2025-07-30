import Cookies from "js-cookie";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3010/api";

// Accept parameters and set the values in the request body
export const getnonmatrimarelatedinfo = async (
  HMTypeID: number,
  BoundaryLevelID: string,
  BoundaryID: string,
  UserID: string,
  FromDate: string | null = null,
  ToDate: string | null = null
) => {
  const token = Cookies.get("authToken");

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      HMTypeID,
      BoundaryLevelID,
      BoundaryID,
      UserID,
      FromDate,
      ToDate,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(
      `${BASE_URL}/get-non-matrima-related-info`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch non-matrima related info: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch non-matrima related info error:", error);
    return null;
  }
};


export const getICDSCentreInfo = async (
  BoundaryLevelID: string,
  BoundaryID: string,
  UserID: string,
  FromDate: string | null = null,
  ToDate: string | null = null
) => {
  const token = Cookies.get("authToken");

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      BoundaryLevelID,
      BoundaryID,
      UserID,
      FromDate,
      ToDate,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(
      `${BASE_URL}/get-icds-centre-info`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ICDS centre info: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch ICDS centre info error:", error);
    return null;
  }
};


export const getHealthCentreInfo = async (
  BoundaryLevelID: string,
  BoundaryID: string,
  UserID: string,
  FromDate: string | null = null,
  ToDate: string | null = null
) => {
  const token = Cookies.get("authToken");

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      BoundaryLevelID,
      BoundaryID,
      UserID,
      FromDate,
      ToDate,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(
      `${BASE_URL}/get-health-centre-info`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch health centre info: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch health centre info error:", error);
    return null;
  }
};