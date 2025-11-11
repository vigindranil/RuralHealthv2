import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom"; // 1. Import useSearchParams
import { Plus, Minus, FileDown, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { decodeJwtToken } from "../utils/decodetoken";
import Cookies from "js-cookie";
import { ColumnDef } from "../components/DataTable";
import DataTable from "../components/DataTable";

// API Functions
import { getRawUnderageMarriageData } from "../api/dataEntry";
import { getnonmatrimarelatedinfo } from "../api/fetchCall";
import { formatDateForDisplay } from "../utils/dateUtils";

// --- Type Definitions ---
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
  [key: string]: string;
}

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

interface DecodedToken {
  BoundaryLevelID?: number;
  BoundaryID?: number;
  UserID?: string;
}

// --- Leaflet Icon Setup ---
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Column Definitions ---
const allTableColumns: ColumnDef<TableRow>[] = [
  { header: "Name", accessorKey: "Name" },
  { header: "District", accessorKey: "District" },
  { header: "Block", accessorKey: "Block" },
  { header: "Gram Panchayat (GP)", accessorKey: "Gram Panchayat (GP)" },
  { header: "Village Name", accessorKey: "Village Name" },
  { header: "Husband Name", accessorKey: "Husband Name" },
  { header: "Phone Number", accessorKey: "Phone Number" },
  { header: "ICDS Centre Name", accessorKey: "ICDS Centre Name" },
  { header: "ICDS Centre ID", accessorKey: "ICDS Centre ID" },
  { header: "Health Centre Name", accessorKey: "Health Centre Name" },
  { header: "Health Centre ID", accessorKey: "Health Centre ID" },
];

const mainTableColumns: ColumnDef<TableRow>[] = [
  { header: "Name", accessorKey: "Name" },
  { header: "Husband Name", accessorKey: "Husband Name" },
  { header: "Gram Panchayat (GP)", accessorKey: "Gram Panchayat (GP)" },
  { header: "ICDS Centre Name", accessorKey: "ICDS Centre Name" },
  { header: "Health Centre Name", accessorKey: "Health Centre Name" },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

const ModuleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // 2. Get URL search params

  // 3. Extract fromDate and toDate from the URL
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");




  const token = Cookies.get("authToken");
  const decoded: DecodedToken | null = decodeJwtToken(token);
  const BoundaryLevelID = decoded?.BoundaryLevelID;
  const BoundaryID = decoded?.BoundaryID;
  const UserID = decoded?.UserID || "1";

  const [pageTitle, setPageTitle] = useState<string>("Loading...");
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const idsToUseNonMatrimaApi = [2, 10, 11, 12];


  // Format the date range for display
  const dateRangeDisplay = fromDate && toDate
    ? `${formatDate(fromDate)} - ${formatDate(toDate)}`
    : "selected period";

  useEffect(() => {
    const fetchDataAndTransform = async () => {
      if (!id || !BoundaryLevelID || !BoundaryID || !UserID) {
        setError("User information is missing. Please log in again.");
        setIsLoading(false);
        return;
      }

      // Add a check to ensure dates are present in the URL
      if (!fromDate || !toDate) {
        setError("Date range is missing. Please return to the dashboard and select a period.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setTableData([]);

      try {
        let apiFunction: (...args: any[]) => Promise<any>;
        let requestParams: any[];
        const numericId = Number(id);

        if (idsToUseNonMatrimaApi.includes(numericId)) {
          apiFunction = getnonmatrimarelatedinfo;
          // 4. Use the dates extracted from the URL
          requestParams = [
            numericId,
            String(BoundaryLevelID),
            String(BoundaryID),
            String(UserID),
            fromDate,
            toDate
          ];
        } else {
          apiFunction = getRawUnderageMarriageData;
          // 4. Use the dates extracted from the URL
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
  }, [id, BoundaryID, BoundaryLevelID, UserID, fromDate, toDate]); // 5. Added fromDate and toDate to dependencies

  const handleExport = (): void => {
    if (!tableData.length) return;
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), `${pageTitle.replace(/\s+/g, '_') || 'report'}.xlsx`);
  };

  const renderRowDetails = (row: TableRow) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {allTableColumns.map((col) => (
        <div key={col.header} className="flex gap-2 items-baseline">
          <span className="font-semibold text-blue-800 min-w-[150px]">{col.header}:</span>
          <span className="text-gray-800">{row[col.accessorKey] || <span className="text-gray-400 italic">N/A</span>}</span>
        </div>
      ))}
    </div>
  );

  const NoDataDisplay = () => (
    <div className="text-center py-16">
      <Inbox className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No Records Found</h3>
      <p className="mt-1 text-sm text-gray-500">There is no data available for this indicator for the selected period.</p>
      {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
    </div>
  );

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
            Detailed data for {dateRangeDisplay}
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

          <DataTable
            data={tableData}
            columns={mainTableColumns}
            isLoading={isLoading}
            isExpandable={true}
            renderExpandedRow={renderRowDetails}
            noDataComponent={<NoDataDisplay />}
          />

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