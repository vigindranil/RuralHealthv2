import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Minus, FileDown, Inbox } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getRawUnderageMarriageData } from "../api/dataEntry";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { decodeJwtToken } from "../utils/decodetoken";
import Cookies from "js-cookie";
import { getnonmatrimarelatedinfo } from "../api/fetchCall";

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Maps URL slug to the specific API function to call
const moduleConfig = {
  "childbirths-last-one-month-only-non-institutional-births": {
    apiFunction: getRawUnderageMarriageData,
  },
  "under-age-marriages": {
    apiFunction: getRawUnderageMarriageData,
  },
  "low-birth-weight-children": {
    apiFunction: getRawUnderageMarriageData,
  },
  "children-who-have-not-completed-immunization": {
    apiFunction: getRawUnderageMarriageData,
  },
  "under-20-years-of-age-pregnant-mothers": {
    apiFunction: getRawUnderageMarriageData,
  },
  "teenage-pregrancy-regutered": {
    apiFunction: getRawUnderageMarriageData,
  },
  "high-risk-pregnancies": {
    apiFunction: getRawUnderageMarriageData,
  },
  "malnourished-children": {
    apiFunction: getRawUnderageMarriageData,
  },
  "underweight-children": {
    apiFunction: getRawUnderageMarriageData,
  },
  "anemic-adolescent-girls": {
    apiFunction: getRawUnderageMarriageData,
  },
  "infectious-diseases": {
    apiFunction: getRawUnderageMarriageData,
  },
  "tb-leprosy-patients": {
    apiFunction: getRawUnderageMarriageData,
  },
};

// Table headers matching the API response structure
const tableHeaders = [
  "Name",
  "District",
  "Block",
  "Gram Panchayat (GP)",
  "Village Name",
  "Husband Name",
  "Phone Number",
  "ICDS Centre Name",
  "ICDS Centre ID",
  "Health Centre Name",
  "Health Centre ID",
];

export default function ModuleDetailPage() {
  const { moduleId, id } = useParams();
  const token = Cookies.get("authToken");
  const decoded = decodeJwtToken(token);
  const BoundaryLevelID = decoded?.BoundaryLevelID;
  const BoundaryID = decoded?.BoundaryID;
  const UserID = decoded?.UserID || "1";
  const navigate = useNavigate();

  const [pageTitle, setPageTitle] = useState("Loading...");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  // If the id is one of [2, 10, 11, 12], call the fetchCall function

  const idsToUseFetchCall = [2, 10, 11, 12];

  useEffect(() => {
    const fetchDataAndTransform = async () => {
      if (idsToUseFetchCall.includes(Number(id))) {
        try {
          setIsLoading(true);
          setError(null);
          const response = await getnonmatrimarelatedinfo(
            Number(id),
            BoundaryLevelID,
            BoundaryID,
            UserID
          );

          if (response && response.status === 0 && response.data) {
            const { title, records } = response.data;
            setPageTitle(title || "Module Details");

            // Transform the records to match our table structure
            const transformedRecords = records.map((record) => ({
              Name: record.name || "N/A",
              District: record.district || "N/A",
              Block: record.block || "N/A",
              "Gram Panchayat (GP)": record.gramPanchayat || "N/A",
              "Village Name": record.village || "N/A",
              "Husband Name": record.husbandName || "N/A",
              "Phone Number": record.phone || "N/A",
              "ICDS Centre Name": record.icdsCentreName || "N/A",
              "ICDS Centre ID": record.icdsCentreId || "N/A",
              "Health Centre Name": record.healthCentreName || "N/A",
              "Health Centre ID": record.healthCentreId || "N/A",
            }));

            setTableData(transformedRecords);
          } else {
            setTableData([]);
            setPageTitle("No Data Available");
          }
        } catch (err) {
          setError("Failed to fetch data using fetchCall");
          setIsLoading(false);
        }
        finally {

          setIsLoading(false);

        }
      }
      // ...rest of the original fetchDataAndTransform logic...
    };

    fetchDataAndTransform();
    // eslint-disable-next-line
  }, [moduleId, id, BoundaryLevelID, BoundaryID, UserID]);

  useEffect(() => {
    const getDatesFromStorage = () => {
      const savedDateRange = sessionStorage.getItem('dashboardDateRange');
      if (savedDateRange) {
        return JSON.parse(savedDateRange);
      }
      return { fromDate: null, toDate: null }; // Default values
    };
    const fetchDataAndTransform = async () => {
      if (!idsToUseFetchCall.includes(Number(id))) {
        const config = moduleConfig[moduleId];
        const { fromDate, toDate } = getDatesFromStorage();

        if (!config) {
          setError("Module configuration not found");
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        const requestParams = {
          HMTypeID: id,
          BoundaryLevelID: BoundaryLevelID,
          BoundaryID: BoundaryID,
          UserID: UserID,
          FromDate: fromDate,
          ToDate: toDate,
        };

        try {
          // Updated to handle the actual API response structure
          const response = await config.apiFunction(requestParams);

          // The API returns the full response, not just records
          if (response && response.status === 0 && response.data) {
            const { title, records } = response.data;
            setPageTitle(title || "Module Details");

            // Transform the records to match our table structure
            const transformedRecords = records.map((record) => ({
              Name: record.name || "N/A",
              District: record.district || "N/A",
              Block: record.block || "N/A",
              "Gram Panchayat (GP)": record.gramPanchayat || "N/A",
              "Village Name": record.village || "N/A",
              "Husband Name": record.husbandName || "N/A",
              "Phone Number": record.phone || "N/A",
              "ICDS Centre Name": record.icdsCentreName || "N/A",
              "ICDS Centre ID": record.icdsCentreId || "N/A",
              "Health Centre Name": record.healthCentreName || "N/A",
              "Health Centre ID": record.healthCentreId || "N/A",
            }));

            setTableData(transformedRecords);
          } else {
            setTableData([]);
            setPageTitle("No Data Available");
          }
        } catch (err) {
          console.error("API Error:", err);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          ); 
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDataAndTransform();
  }, [moduleId, id, BoundaryID, BoundaryLevelID, UserID]);

  const handleExport = () => {
    if (!tableData.length) return;
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    // saveAs(new Blob([excelBuffer]), `${pageTitle.replace(/\s+/g, '_')}_Jalpaiguri.xlsx`);
    saveAs(new Blob([excelBuffer]), `report.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 text-xl font-semibold text-blue-700">
        Loading Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-xl font-semibold text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 drop-shadow">
            {pageTitle}{" "}
            <span className="text-lg font-medium text-blue-500">
              (Jalpaiguri)
            </span>
          </h1>
          <p className="text-gray-500 text-lg">
            Detailed data for the last one month
          </p>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="text-lg font-semibold text-blue-800">
              Total Records: {tableData.length}
            </div>
            <button
              onClick={handleExport}
              disabled={!tableData.length}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileDown className="w-4 h-4" /> Export to Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            {tableData.length > 0 ? (
              <table className="min-w-[1200px] w-full divide-y divide-blue-200">
                <thead className="bg-gradient-to-r from-blue-50 to-green-50">
                  <tr>
                    <th className="w-8"></th>
                    {tableHeaders.map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {tableData.map((row, idx) => (
                    <React.Fragment key={idx}>
                      <tr className="group hover:bg-blue-50/70 transition-colors border-b border-blue-100">
                        <td className="px-4 py-2 text-center align-top">
                          <button
                            onClick={() =>
                              setExpanded((prev) => (prev === idx ? null : idx))
                            }
                            className="p-1.5 focus:outline-none"
                            aria-label="Expand row"
                          >
                            {expanded === idx ? (
                              <Minus className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Plus className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        </td>
                        {tableHeaders.map((header) => (
                          <td
                            key={header}
                            className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap align-top group-hover:text-blue-900"
                          >
                            {row[header] || (
                              <span className="text-gray-400 italic">N/A</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      {expanded === idx && (
                        <tr>
                          <td
                            colSpan={tableHeaders.length + 1}
                            className="bg-gradient-to-r from-blue-50 to-green-50 px-8 py-6 text-gray-700"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                              {tableHeaders.map((header) => (
                                <div
                                  key={header}
                                  className="flex gap-2 items-baseline"
                                >
                                  <span className="font-semibold text-blue-800 min-w-[150px]">
                                    {header}:
                                  </span>
                                  <span className="text-gray-800">
                                    {row[header] || (
                                      <span className="text-gray-400 italic">
                                        N/A
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No Records Found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  There is no data available for this indicator.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <div className="bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Reported Cases by Centre (Map)
            </h2>
            <MapContainer
              center={[26.5825, 88.7237]}
              zoom={11}
              scrollWheelZoom={false}
              style={{ height: 350, width: "100%" }}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Add Marker logic here if needed */}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
