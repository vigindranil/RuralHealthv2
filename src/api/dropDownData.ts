import Cookies from "js-cookie";

export const getAllHealthCentres = async () => {
  const token = Cookies.get("authToken");

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      BoundaryLevelID: "2",
      BoundaryID: "9",
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect, // Type assertion to fix lint error
    };

    const response = await fetch(
      "http://localhost:3010/api/get-all-health-centre",
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

export const getAllIcdsCentres = async () => {
  const token = Cookies.get("authToken");

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      InHealthCentreID: "1",
      BoundaryLevelID: "2",
      BoundaryID: "9",
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect, // Type assertion to fix lint error
    };

    const response = await fetch(
      "http://localhost:3010/api/get-all-icds-centre",
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
