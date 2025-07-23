import Cookies from "js-cookie";

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
