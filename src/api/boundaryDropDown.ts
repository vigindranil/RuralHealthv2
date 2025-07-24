import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3010/api";

export const boundaryDetailsByBoundaryId = async (
  boundaryLevelId: string,
  boundaryId: string,
  loginUserId: string
) => {
    
  const token = Cookies.get("authToken");

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      BoundaryLevelID: boundaryLevelId,
      BoundaryID: boundaryId,
      IsUrban: "0",
      LoginUserID: loginUserId,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect, // Type assertion to fix lint error
    };

    const response = await fetch(
      `${BASE_URL}/get-boundary-details-by-boundary-id`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch health centres: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch health centres error:", error);
    return null;
  }
};
