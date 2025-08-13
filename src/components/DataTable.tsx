import React, { useState } from "react";
import { Plus, Minus, Inbox, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

// Updated ColumnDef to support both accessorKey and accessorFn
export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    accessorFn?: (row: T) => any;
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading: boolean;
    isExpandable?: boolean;
    renderExpandedRow?: (row: T) => React.ReactNode;
    noDataComponent?: React.ReactNode;
}

const DataTable = <T extends Record<string, any>>({
    data,
    columns,
    isLoading,
    isExpandable = false,
    renderExpandedRow,
    noDataComponent,
}: DataTableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState<number | null>(null);

    // Reset pagination when data changes
    React.useEffect(() => {
        setCurrentPage(1);
        setExpanded(null);
    }, [data]);

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = data.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setExpanded(null);
            // window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleToggleExpand = (index: number) => {
        setExpanded((prev) => (prev === index ? null : index));
    };

    // Helper function to get cell value - supports both accessorKey and accessorFn
    const getCellValue = (row: T, column: ColumnDef<T>) => {
        if (column.accessorFn) {
            return column.accessorFn(row);
        }
        if (column.accessorKey) {
            return row[column.accessorKey];
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="text-center py-16 text-lg font-semibold text-blue-700">
                Loading Data...
            </div>
        );
    }

    if (data.length === 0) {
        return (
            noDataComponent || (
                <div className="text-center py-16">
                    <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Records Found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        There is no data available for this query.
                    </p>
                </div>
            )
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-[1200px] w-full divide-y divide-blue-200">
                    <thead className="bg-gradient-to-r from-blue-50 to-green-50">
                        <tr>
                            {isExpandable && <th className="w-8"></th>}
                            {columns.map((col) => (
                                <th
                                    key={col.header}
                                    className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                        {currentData.map((row, idx) => {
                            const absoluteIndex = startIndex + idx;
                            return (
                                <React.Fragment key={absoluteIndex}>
                                    <tr
                                        className={`group hover:bg-blue-50/70 transition-colors border-b border-blue-100 ${isExpandable ? 'cursor-pointer' : ''}`}
                                        onClick={isExpandable ? () => handleToggleExpand(absoluteIndex) : undefined}
                                    >
                                        {isExpandable && (
                                            <td className="px-4 py-2 text-center align-top">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleExpand(absoluteIndex);
                                                    }}
                                                    className="p-1.5 focus:outline-none"
                                                    aria-label="Expand row"
                                                >
                                                    {expanded === absoluteIndex ? (
                                                        <Minus className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <Plus className="w-4 h-4 text-blue-600" />
                                                    )}
                                                </button>
                                            </td>
                                        )}
                                        {columns.map((col) => {
                                            const cellValue = getCellValue(row, col);
                                            return (
                                                <td key={col.header} className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap align-top group-hover:text-blue-900">
                                                    {cellValue || <span className="text-gray-400 italic">N/A</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {isExpandable && expanded === absoluteIndex && renderExpandedRow && (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="bg-gradient-to-r from-blue-50 to-green-50 px-8 py-6 text-gray-700">
                                                {renderExpandedRow(row)}
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
                <div className="flex items-center justify-between mt-6 px-1 pt-4 border-t border-blue-100">
                    <span className="text-sm font-medium text-gray-700">
                        Showing <span className="font-bold text-blue-800">{startIndex + 1}</span>
                        {' to '}
                        <span className="font-bold text-blue-800">{Math.min(endIndex, data.length)}</span>
                        {' of '}
                        <span className="font-bold text-blue-800">{data.length}</span> results
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
        </>
    );
};

export default DataTable;