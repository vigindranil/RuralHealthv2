import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Minus, FileDown, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { decodeJwtToken } from "../utils/decodetoken";
import Cookies from "js-cookie";

// API Functions
import { getRawUnderageMarriageData } from "../api/dataEntry";
import { getnonmatrimarelatedinfo } from "../api/fetchCall";

// --- Type Definitions for TypeScript ---

// Shape of the data used directly in the table rows
interface TableRow {
  "Name": string;
  "District": string;
  "Block": string;
  "Gram Panchayat (GP)": string;
  "Village Name": string;
  "Husband Name": string;
  "Phone Number": string;
  "ICDS Centre Name": string;
  "ICDS Centre ID": string;
  "Health Centre Name": string;
  "Health Centre ID": string;
  [key: string]: string; // Index signature for flexible access
}

// Shape of a single record from the API response
interface ApiRecord {
  name?: string;
  district?: string;
  block?: string;
  gramPanchayat?: string;
  village?: string;
  husbandName?: string;
  phone?: string;
  icdsCentreName?: string;
  icdsCentreId?: string;
  healthCentreName?: string;
  healthCentreId?: string;
}

// Shape of the decoded JWT token payload
interface DecodedToken {
  BoundaryLevelID?: number;
  BoundaryID?: number;
  UserID?: string;
}

// Setup for Leaflet map icons
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Table headers remain the same, matching the API response structure
const tableHeaders: string[] = [
  "Name", "District", "Block", "Gram Panchayat (GP)", "Village Name",
  "Husband Name", "Phone Number", "ICDS Centre Name", "ICDS Centre ID",
  "Health Centre Name", "Health Centre ID",
];

// Define items per page for pagination
const ITEMS_PER_PAGE = 10;

const ModuleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const token = Cookies.get("authToken");
  const decoded: DecodedToken | null = decodeJwtToken(token);
  const BoundaryLevelID = decoded?.BoundaryLevelID;
  const BoundaryID = decoded?.BoundaryID;
  const UserID = decoded?.UserID || "1";

  const [pageTitle, setPageTitle] = useState<string>("Loading...");
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const idsToUseNonMatrimaApi = [2, 10, 11, 12];

  useEffect(() => {
    const fetchDataAndTransform = async () => {
      if (!id || !BoundaryLevelID || !BoundaryID || !UserID) {
        setError("User information is missing. Please log in again.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setTableData([]);
      setCurrentPage(1);
      setExpanded(null);

      try {
        let apiFunction: (...args: any[]) => Promise<any>;
        let requestParams: any[];
        const numericId = Number(id);

        if (idsToUseNonMatrimaApi.includes(numericId)) {
          apiFunction = getnonmatrimarelatedinfo;
          requestParams = [numericId, String(BoundaryLevelID), String(BoundaryID), String(UserID), null, null];
        } else {
          const savedDateRange = sessionStorage.getItem('dashboardDateRange');
          const { fromDate, toDate } = savedDateRange ? JSON.parse(savedDateRange) : { fromDate: null, toDate: null };

          apiFunction = getRawUnderageMarriageData;
          requestParams = [{
            HMTypeID: id,
            BoundaryLevelID: String(BoundaryLevelID),
            BoundaryID: String(BoundaryID),
            UserID: String(UserID),
            FromDate: fromDate,
            ToDate: toDate,
          }];
        }

        const response = await apiFunction(...requestParams);

        if (response && response.status === 0 && response.data) {
          const { title, records } = response.data;
          setPageTitle(title || "Module Details");

          if (records && records.length > 0) {
            const transformedRecords: TableRow[] = records.map((record: ApiRecord) => ({
              "Name": record.name || "N/A",
              "District": record.district || "N/A",
              "Block": record.block || "N/A",
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
          }
        } else {
          setTableData([]);
          setPageTitle("No Data Available");
          if (response && response.message) {
            setError(response.message);
          }
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndTransform();
  }, [id, BoundaryID, BoundaryLevelID, UserID]);

  const handleExport = (): void => {
    if (!tableData.length) return;
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), `${pageTitle.replace(/\s+/g, '_') || 'report'}.xlsx`);
  };

  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTableData = tableData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setExpanded(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 text-xl font-semibold text-blue-700">
        Loading Details...
      </div>
    );
  }

  if (error && !tableData.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-xl font-semibold text-red-700 p-4 text-center">
        <h2>Error Fetching Data</h2>
        <p className="text-sm font-normal text-red-600 mt-2">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all text-sm"
        >
          ← Back to Dashboard
        </button>
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
            Detailed data for the selected period
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
                      <th key={header} className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {currentTableData.map((row, idx) => {
                    const absoluteIndex = startIndex + idx;
                    return (
                      <React.Fragment key={absoluteIndex}>
                        <tr className="group hover:bg-blue-50/70 transition-colors border-b border-blue-100">
                          <td className="px-4 py-2 text-center align-top">
                            <button onClick={() => setExpanded((prev) => (prev === absoluteIndex ? null : absoluteIndex))} className="p-1.5 focus:outline-none" aria-label="Expand row">
                              {expanded === absoluteIndex ? <Minus className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
                            </button>
                          </td>
                          {tableHeaders.map((header) => (
                            <td key={header} className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap align-top group-hover:text-blue-900">
                              {row[header] || <span className="text-gray-400 italic">N/A</span>}
                            </td>
                          ))}
                        </tr>
                        {expanded === absoluteIndex && (
                          <tr>
                            <td colSpan={tableHeaders.length + 1} className="bg-gradient-to-r from-blue-50 to-green-50 px-8 py-6 text-gray-700">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                {tableHeaders.map((header) => (
                                  <div key={header} className="flex gap-2 items-baseline">
                                    <span className="font-semibold text-blue-800 min-w-[150px]">{header}:</span>
                                    <span className="text-gray-800">{row[header] || <span className="text-gray-400 italic">N/A</span>}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Records Found</h3>
                <p className="mt-1 text-sm text-gray-500">There is no data available for this indicator for the selected period.</p>
                {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-1 pt-4 border-t border-blue-100">
              <span className="text-sm font-medium text-gray-700">
                Showing <span className="font-bold text-blue-800">{startIndex + 1}</span>
                {' to '}
                <span className="font-bold text-blue-800">{Math.min(endIndex, tableData.length)}</span>
                {' of '}
                <span className="font-bold text-blue-800">{tableData.length}</span> results
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-white px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Go to previous page"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center rounded-lg border border-blue-600 bg-white px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Go to next page"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10">
          <div className="bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Reported Cases by Centre (Map)</h2>
            <MapContainer center={[26.5825, 88.7237]} zoom={11} scrollWheelZoom={false} style={{ height: 350, width: "100%" }}>
              <TileLayer attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;