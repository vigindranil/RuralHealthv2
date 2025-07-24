import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, FileDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getRawUnderageMarriageData } from '../api/dataEntry'; // Assumes this path is correct
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconUrl: 'https://www.s-parking.com/assets/marker-icon-2x.png',
  iconRetinaUrl: 'https://www.s-parking.com/assets/marker-icon-2x.png',
  shadowUrl: '', // You can provide a shadow image URL if you want, or leave as empty string
});

const customIcon = new L.Icon({
  iconUrl: 'https://www.s-parking.com/assets/marker-icon-2x.png',
  iconRetinaUrl: 'https://www.s-parking.com/assets/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '',
  shadowSize: [41, 41],
});

// Field definitions for each module
const moduleFields = {
  'childbirths': [
    "Mother's ID (Matri Ma ID)", "Mother's Name", "District", "Block", "Gram Panchayat (GP)", "Village Name", "Husband Name", "Phone Number", "ICDS Centre Name", "ICDS Centre ID", "Health Centre Name", "Health Centre ID"
  ],
  'underage-marriage': [
    "Name", "District", "Block", "Gram Panchayat (GP)", "Village Name", "Husband Name", "Phone Number", "ICDS Centre Name", "ICDS Centre ID", "Health Centre Name", "Health Centre ID"
  ],
  // ... other module fields ...
};

// Mock data for Jalpaiguri district for each module
const mockData = {
  'childbirths': [
    {
      "Mother's ID (Matri Ma ID)": 'MM12345', "Mother's Name": 'Rina Das', "District": 'Jalpaiguri', "Block": 'Maynaguri', "Gram Panchayat (GP)": 'Binnaguri', "Village Name": 'Maynaguri', "Husband Name": 'Raju Das', "Phone Number": '9876543210', "ICDS Centre Name": 'ICDS-1', "ICDS Centre ID": 'ICDS001', "Health Centre Name": 'Maynaguri PHC', "Health Centre ID": 'HC001'
    },
    {
      "Mother's ID (Matri Ma ID)": 'MM54321', "Mother's Name": 'Mina Roy', "District": 'Jalpaiguri', "Block": 'Dhupguri', "Gram Panchayat (GP)": 'Dhupguri', "Village Name": 'Dhupguri', "Husband Name": 'Bimal Roy', "Phone Number": '9876501234', "ICDS Centre Name": 'ICDS-2', "ICDS Centre ID": 'ICDS002', "Health Centre Name": 'Dhupguri PHC', "Health Centre ID": 'HC002'
    }
  ],
  'underage-marriage': [], // This will be populated by the API call
  // ... other mock data ...
};

const moduleTitles = {
  'childbirths': 'Childbirths (Non-Institutional)',
  'underage-marriage': 'Under Age Marriages',
  'low-birth-weight': 'Low Birth Weight Children',
  // ... other module titles ...
};

const centreCoords = {
  'ICDS-1': [26.5825, 88.7237],
  'ICDS-2': [26.5900, 88.7200],
  'ICDS-3': [26.5200, 88.7100],
  'Maynaguri PHC': [26.5800, 88.7300],
  'Dhupguri PHC': [26.6000, 88.7500],
  'Jalpaiguri PHC': [26.5400, 88.7200],
};

const ROWS_PER_PAGE = 10;

export default function ModuleDetailPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const title = moduleId ? moduleTitles[moduleId] : 'Module Details';
  const fields = moduleId ? moduleFields[moduleId] : undefined;

  const [expanded, setExpanded] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tableData, setTableData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (moduleId !== 'underage-marriage') {
      setTableData(null); // Reset API data when navigating away
      return;
    }

    const fetchDataAndTransform = async () => {
      setIsLoading(true);
      setError(null);

      const requestParams = {
        "HMTypeID": "1",
        "BoundaryLevelID": "2",
        "BoundaryID": "9",
        "UserID": "1",
        "FromDate": "2025-05-01",
        "ToDate": "2025-05-31"
      };

      try {
        const rawRecords = await getRawUnderageMarriageData(requestParams);

        // Defensive check to prevent runtime errors if API returns non-array
        if (Array.isArray(rawRecords)) {
          const transformedRecords = rawRecords.map((record) => ({
            "Name": record.name,
            "District": record.district,
            "Block": record.block,
            "Gram Panchayat (GP)": record.gramPanchayat,
            "Village Name": record.village,
            "Husband Name": record.husbandName,
            "Phone Number": record.phone,
            "ICDS Centre Name": record.icdsCentreName,
            "ICDS Centre ID": record.icdsCentreId,
            "Health Centre Name": record.healthCentreName,
            "Health Centre ID": record.healthCentreId,
          }));
          setTableData(transformedRecords);
        } else {
          // Handle cases where the API call was successful but data is not an array
          setTableData([]);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndTransform();
  }, [moduleId]);

  const data = useMemo(() => {
    if (moduleId === 'underage-marriage') {
      return tableData; // Use the fetched and transformed data from state
    }
    // For all other modules, use the static mock data
    return moduleId ? mockData[moduleId] : undefined;
  }, [moduleId, tableData]);

  const filteredData = useMemo(() => {
    if (!data) return []; // Safety check for initial null state
    if (!fields) return []; // Safety check
    let rows = data;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      rows = rows.filter(row =>
        fields.some(f => String(row[f] ?? '').toLowerCase().includes(s))
      );
    }
    if (sortField) {
      rows = [...rows].sort((a, b) => {
        const aVal = a[sortField] ?? '';
        const bVal = b[sortField] ?? '';
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [data, fields, search, sortField, sortOrder]);

  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search, sortField, sortOrder]);

  const handleExport = () => {
    if (!filteredData || !fields) return;
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(row => {
      const obj = {};
      fields.forEach(f => { obj[f] = row[f] ?? ''; });
      return obj;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${title.replace(/\s+/g, '_')}_Jalpaiguri.xlsx`);
  };

  const { icdsCases, healthCentreCases } = useMemo(() => {
    const icds = {};
    const health = {};
    if (data) {
      data.forEach(row => {
        const icdsName = row['ICDS Centre Name'];
        const hcName = row['Health Centre Name'];
        if (icdsName) icds[icdsName] = (icds[icdsName] || 0) + 1;
        if (hcName) health[hcName] = (health[hcName] || 0) + 1;
      });
    }
    return { icdsCases: icds, healthCentreCases: health };
  }, [data]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // UI states for loading and error
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-blue-50 text-xl font-semibold text-blue-700">Loading Details...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-red-50 text-xl font-semibold text-red-700">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all text-sm">
            ← Back to Dashboard
          </button>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 drop-shadow">{title} <span className="text-lg font-medium text-blue-500">(Jalpaiguri)</span></h1>
          <p className="text-gray-500 text-lg">Detailed data for the last one month</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-2xl border border-blue-100 p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white/80 border border-blue-100 rounded-lg px-3 py-2 shadow-sm w-full sm:w-80">
              <Search className="w-4 h-4 text-blue-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full bg-transparent outline-none text-gray-700 placeholder:text-blue-300 text-sm" />
            </div>
            <button onClick={handleExport} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all text-sm">
              <FileDown className="w-4 h-4" /> Export to Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full divide-y divide-blue-200">
              <thead className="bg-gradient-to-r from-blue-50 to-green-50">
                <tr>
                  <th className="w-8"></th>
                  {fields && fields.map((key) => (
                    <th key={key} className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none group" onClick={() => handleSort(key)}>
                      <span className="flex items-center gap-1">
                        {key}
                        {sortField === key ? (sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-500" /> : <ArrowDown className="w-3 h-3 text-blue-500" />) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {paginatedData && fields && paginatedData.map((row, idx) => {
                  const globalIdx = (page - 1) * ROWS_PER_PAGE + idx;
                  const isOpen = expanded === globalIdx;
                  return (
                    <React.Fragment key={globalIdx}>
                      <tr className={`group hover:bg-blue-50/70 transition-colors border-b border-blue-100 ${isOpen ? 'bg-blue-50/60 shadow-inner' : ''}`}>
                        <td className="text-center align-top">
                          <button onClick={() => setExpanded(isOpen ? null : globalIdx)} className="focus:outline-none rounded-full bg-blue-100 hover:bg-blue-200 p-0.5 shadow-sm border border-blue-200 transition-all w-6 h-6 flex items-center justify-center" aria-label={isOpen ? 'Collapse row' : 'Expand row'}>
                            {isOpen ? <Minus className="w-3.5 h-3.5 text-blue-600 mx-auto" /> : <Plus className="w-3.5 h-3.5 text-blue-600 mx-auto" />}
                          </button>
                        </td>
                        {fields.map((key, i) => (
                          <td key={i} className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap align-top group-hover:text-blue-900">
                            {row[key] ?? <span className="text-gray-400 italic">-</span>}
                          </td>
                        ))}
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={fields.length + 1} className="bg-gradient-to-r from-blue-50 to-green-50 px-8 py-6 text-gray-700 text-base rounded-b-2xl border-t border-blue-100 shadow-inner">
                            <div className="flex flex-col gap-3">
                              {fields.map((key, i) => (
                                <div key={i} className="flex gap-2 items-baseline">
                                  <span className="font-semibold text-blue-800 min-w-[200px] text-sm sm:text-base">{key}:</span>
                                  <span className="text-gray-800 text-sm sm:text-base">{row[key] ?? <span className="text-gray-400 italic">-</span>}</span>
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
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
              <span className="text-blue-900 font-bold text-lg">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
          )}
        </div>
        <div className="mt-10">
          <div className="bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Reported Cases by Centre (Map)</h2>
            <MapContainer center={[26.5825, 88.7237]} zoom={11} scrollWheelZoom={false} style={{ height: 350, width: '100%' }}>
              <TileLayer attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {Object.entries(icdsCases).map(([name, count]) =>
                centreCoords[name] ? (
                  <Marker key={name} icon={customIcon} position={centreCoords[name]}>
                    <Popup>
                      <div className="font-semibold text-blue-700">{name}</div>
                      <div className="text-sm">ICDS Centre</div>
                      <div className="text-green-700 font-bold mt-1">{count} case(s) reported</div>
                    </Popup>
                  </Marker>
                ) : null
              )}
              {Object.entries(healthCentreCases).map(([name, count]) =>
                centreCoords[name] ? (
                  <Marker key={name} icon={customIcon} position={centreCoords[name]}>
                    <Popup>
                      <div className="font-semibold text-blue-700">{name}</div>
                      <div className="text-sm">Health Centre</div>
                      <div className="text-green-700 font-bold mt-1">{count} case(s) reported</div>
                    </Popup>
                  </Marker>
                ) : null
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}