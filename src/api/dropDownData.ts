import Cookies from "js-cookie";
import { decodeJwtToken } from "../utils/decodetoken";

export const getAllHealthandIcdsCentres = async () => {
  const token = Cookies.get("authToken");
  const decoded = decodeJwtToken(token);
  const BoundaryLevelID = decoded?.BoundaryLevelID;
  const BoundaryID = decoded?.BoundaryID;

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      BoundaryLevelID: BoundaryLevelID,
      BoundaryID: BoundaryID,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect, // Type assertion to fix lint error
    };

    const response = await fetch(
      "http://localhost:3010/api/get-health-and-icds-centre",
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

