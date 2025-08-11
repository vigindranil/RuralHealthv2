import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Select from 'react-select';
import { Search, Download, Calendar } from 'lucide-react';
import { fetchMonthlyDateRanges, MonthDateRange } from "../services/dashboardApi"; // Ensure path is correct
import { fetchBoundaryDetails, Boundary, ReportFilters } from '../api/reportsApi';
import { decodeJwtToken } from '../utils/decodetoken';
import Cookies from "js-cookie";



interface FilterSectionProps {
    onFilter: (filters: { fromDate: string | null; toDate: string | null; block: string; gp: string; }) => void;
    onExport: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilter, onExport }) => {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const [monthlyDateRanges, setMonthlyDateRanges] = useState<MonthDateRange[]>([]);
    const [isLoadingMonths, setIsLoadingMonths] = useState(false);
    const [locationFilters, setLocationFilters] = useState({ block: 'ALL', gp: 'ALL' });
    const yearOptions = useMemo(() => Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => ({ value: y, label: y.toString() })), []);
    const [blocks, setBlocks] = useState<Boundary[]>([]);
    const [gps, setGps] = useState<Boundary[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<string>(""); // Stores stringified Boundary object
    const [selectedGp, setSelectedGp] = useState<string>(""); // Stores stringified Boundary object
    const [isLoadingBlocks, setIsLoadingBlocks] = useState(true);
    const [isLoadingGps, setIsLoadingGps] = useState(false);

    useEffect(() => {
        const getMonths = async () => {
            setIsLoadingMonths(true);
            try {
                setMonthlyDateRanges(await fetchMonthlyDateRanges(selectedYear));
            } catch (err) {
                console.error(err);
                setMonthlyDateRanges([]);
            } finally {
                setIsLoadingMonths(false);
                setSelectedMonth("");
            }
        };
        getMonths();
    }, [selectedYear]);

    const monthOptions = useMemo(() => monthlyDateRanges.map(m => ({ value: JSON.stringify(m), label: m.month })), [monthlyDateRanges]);

    useEffect(() => {
        const getBlocks = async () => {
            const token = Cookies.get('authToken');
            if (!token) {
                console.error("No auth token found");
                setIsLoadingBlocks(false);
                return;
            }
            try {
                const decoded = decodeJwtToken(token);
                if (decoded && decoded.BoundaryID && decoded.BoundaryLevelID) {
                    const blockData = await fetchBoundaryDetails(decoded.BoundaryID, decoded.BoundaryLevelID);
                    setBlocks(blockData);
                }
            } catch (err) {
                console.error("Failed to fetch blocks:", err);
                setBlocks([]);
            } finally {
                setIsLoadingBlocks(false);
            }
        };
        getBlocks();
    }, []);

    // Effect to fetch GPs when a block is selected
    useEffect(() => {
        if (!selectedBlock) {
            setGps([]);
            setSelectedGp("");
            return;
        }

        const getGps = async () => {
            setIsLoadingGps(true);
            try {
                const block: Boundary = JSON.parse(selectedBlock);
                const gpData = await fetchBoundaryDetails(block.InnerBoundaryID.toString(), block.InnerBoundaryLevelID.toString());
                setGps(gpData);
            } catch (err) {
                console.error("Failed to fetch GPs:", err);
                setGps([]);
            } finally {
                setIsLoadingGps(false);
                setSelectedGp(""); // Reset GP selection when new GPs are loaded
            }
        };
        getGps();
    }, [selectedBlock]);


    const handleSubmit = useCallback(() => {
        let dateFilters = { fromDate: null, toDate: null };
        if (selectedMonth) {
            const monthData: MonthDateRange = JSON.parse(selectedMonth);
            dateFilters = { fromDate: monthData.fromDate, toDate: monthData.toDate };
        }

        const blockData: Boundary | null = selectedBlock ? JSON.parse(selectedBlock) : null;
        const gpData: Boundary | null = selectedGp ? JSON.parse(selectedGp) : null;

        const filters: Omit<ReportFilters, 'block' | 'gp'> = {
            ...dateFilters,
            blockId: blockData?.InnerBoundaryID ?? null,
            blockLevelId: blockData?.InnerBoundaryLevelID ?? null,
            gpId: gpData?.InnerBoundaryID ?? null,
            gpLevelId: gpData?.InnerBoundaryLevelID ?? null,
        };
        onFilter(filters);
    }, [selectedMonth, selectedBlock, selectedGp, onFilter]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"><Calendar className="w-4 h-4 inline-block mr-1" />Select Year</label>
                    <Select value={yearOptions.find(o => o.value === selectedYear)} options={yearOptions} onChange={o => setSelectedYear(o?.value ?? new Date().getFullYear())} classNamePrefix="react-select" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"><Calendar className="w-4 h-4 inline-block mr-1" />Select Month</label>
                    <Select value={monthOptions.find(o => o.value === selectedMonth)} options={monthOptions} onChange={o => setSelectedMonth(o?.value ?? "")} isLoading={isLoadingMonths} isDisabled={isLoadingMonths || !monthlyDateRanges.length} isClearable placeholder={isLoadingMonths ? "Loading..." : "Select Month"} classNamePrefix="react-select" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Block</label>
                    <select value={selectedBlock} onChange={e => setSelectedBlock(e.target.value)} disabled={isLoadingBlocks} className="w-full h-[38px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">ALL</option>
                        {blocks.map(b => <option key={b.InnerBoundaryID} value={JSON.stringify(b)}>{b.InnerBoundaryName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select GP</label>
                    <select value={selectedGp} onChange={e => setSelectedGp(e.target.value)} disabled={!selectedBlock || isLoadingGps} className="w-full h-[38px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">ALL</option>
                        {gps.map(g => <option key={g.InnerBoundaryID} value={JSON.stringify(g)}>{g.InnerBoundaryName}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleSubmit} className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><Search className="w-4 h-4 mr-2" />Submit</button>
                <button onClick={onExport} className="flex items-center justify-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"><Download className="w-4 h-4 mr-2" />Export to Excel</button>
            </div>
        </div>
    );
};

export default FilterSection;