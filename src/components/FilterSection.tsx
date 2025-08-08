import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Search, Download, Calendar } from 'lucide-react';
import { fetchMonthlyDateRanges, MonthDateRange } from "../services/dashboardApi"; // Ensure path is correct

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
    const blocks = ['ALL', 'Block 1', 'Block 2', 'Block 3', 'Block 4'];
    const gps = ['ALL', 'GP 1', 'GP 2', 'GP 3', 'GP 4', 'GP 5'];

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

    const handleSubmit = () => {
        let dateFilters = { fromDate: null, toDate: null };
        if (selectedMonth) {
            const monthData: MonthDateRange = JSON.parse(selectedMonth);
            dateFilters = { fromDate: monthData.fromDate, toDate: monthData.toDate };
        }
        onFilter({ ...dateFilters, ...locationFilters });
    };

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
                    <select value={locationFilters.block} onChange={e => setLocationFilters(f => ({ ...f, block: e.target.value }))} className="w-full h-[38px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">{blocks.map(b => <option key={b} value={b}>{b}</option>)}</select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select GP</label>
                    <select value={locationFilters.gp} onChange={e => setLocationFilters(f => ({ ...f, gp: e.target.value }))} className="w-full h-[38px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">{gps.map(g => <option key={g} value={g}>{g}</option>)}</select>
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