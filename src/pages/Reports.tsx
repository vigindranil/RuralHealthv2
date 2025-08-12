import { useState, useEffect, useCallback } from 'react';
import DataTable, { ColumnDef } from '../components/DataTable';
import FilterSection from '../components/FilterSection';
import MetricsSection from '../components/MetricsSection';
import { fetchGpProfileReport, ReportFilters } from '../api/reportsApi';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// --- NEW COMPONENT: ReportSection ---
// This component provides the header (Title, Count, Export) and correctly
// configures the DataTable for row-by-row expansion.
interface ReportSectionProps<T> {
  title: string;
  data: T[];
  mainColumns: ColumnDef<T>[];
  allColumns: ColumnDef<T>[];
  isLoading: boolean;
}

const ReportSection = <T extends Record<string, any>>({
  title,
  data,
  mainColumns,
  allColumns,
  isLoading,
}: ReportSectionProps<T>) => {

  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No data to export.');
      return;
    }

    // Use the allColumns definition to prepare data for export, ensuring all fields are included
    const exportData = data.map(row => {
      const newRow: Record<string, any> = {};
      allColumns.forEach(col => {
        const key = col.header;
        // @ts-ignore - accessorFn makes it hard for TS to infer the type of `row` correctly
        const value = col.accessorFn ? col.accessorFn(row) : row[col.accessorKey];
        newRow[key] = (value !== 'N/A' && value !== null) ? value : ''; // Export empty string instead of N/A
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`;
    saveAs(new Blob([excelBuffer]), fileName);
  };

  const renderRowDetails = (row: T) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
      {allColumns.map((col) => {
        // @ts-ignore - accessorFn makes it hard for TS to infer the type of `row` correctly
        const value = col.accessorFn ? col.accessorFn(row) : row[col.accessorKey];
        return (
          <div key={col.header} className="flex gap-2 items-baseline">
            <span className="font-semibold text-gray-600 min-w-[150px]">{col.header}:</span>
            <span className="text-gray-800">{value || <span className="text-gray-400 italic">N/A</span>}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {title} <span className="text-base font-medium text-gray-500">({data.length} Records)</span>
        </h3>
        <button
          onClick={handleExport}
          disabled={!data || data.length === 0 || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <FileDown size={16} /> Export to Excel
        </button>
      </div>
      <DataTable
        data={data}
        columns={mainColumns}
        isLoading={isLoading}
        isExpandable={true}
        renderExpandedRow={renderRowDetails}
      />
    </div>
  );
};

// --- Main Component ---
export default function WorkInProgress() {
  const [metricsData, setMetricsData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReportData = useCallback(async (filters: ReportFilters) => {
    setIsLoading(true); setError(null);
    try {
      const data = await fetchGpProfileReport(filters);
      setMetricsData(data.health_metrics_overview); setReportData(data.sections);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadReportData({}); }, [loadReportData]);
  const handleFilter = (filters: ReportFilters) => { loadReportData(filters); };
  const handleGlobalExport = () => alert('Global Export not implemented.');

  // --- COMPLETE & DEDICATED COLUMN DEFINITIONS ---
  // Each section now has its own complete set of columns based on the API response.

  const nameAccessor = (row: any) => row.name || row.MotherName || row.GirlName || row.patient_name || 'N/A';
  const husbandAccessor = (row: any) => row.husband_name || row.HusbandName || row.father_name || 'N/A';
  const contactAccessor = (row: any) => row.phone_number || row.ContactNumber || 'N/A';
  const icdsNameAccessor = (row: any) => row.icds_center_name || row.ICDSCentreName || 'N/A';
  const icdsCodeAccessor = (row: any) => row.icds_code || row.ICDSCentreCode || 'N/A';
  const healthNameAccessor = (row: any) => row.health_center_name || row.HealthCentreName || 'N/A';

  // 1. Mother/Girl Generic Columns (for Childbirths, Marriages, etc.)
  const motherAllColumns = [
    { header: 'Name', accessorFn: nameAccessor }, { header: 'District', accessorKey: 'district' }, { header: 'Block', accessorKey: 'block' }, { header: 'Gram Panchayat (GP)', accessorKey: 'gp' }, { header: 'Village', accessorKey: 'village' }, { header: 'Husband/Father', accessorFn: husbandAccessor }, { header: 'Phone Number', accessorFn: contactAccessor }, { header: 'ICDS Centre', accessorFn: icdsNameAccessor }, { header: 'ICDS Code', accessorFn: icdsCodeAccessor }, { header: 'Health Centre', accessorFn: healthNameAccessor }, { header: 'MatriMa ID', accessorKey: 'MatriMaID' }, { header: 'Health ID', accessorKey: 'HMID' }
  ];
  const motherMainColumns = [
    { header: 'Name', accessorFn: nameAccessor }, { header: 'Husband/Father', accessorFn: husbandAccessor }, { header: 'Gram Panchayat (GP)', accessorKey: 'gp' }, { header: 'ICDS Centre', accessorFn: icdsNameAccessor }, { header: 'Health Centre', accessorFn: healthNameAccessor },
  ];

  // 2. Child Generic Columns (for Low Birth Weight, Malnourished, etc.)
  const childAllColumns = motherAllColumns; // Structure is identical
  const childMainColumns = motherMainColumns; // Structure is identical

  // 3. Anemic Adolescent Girls (Unique: dob, weight)
  const anemicAdolescentGirlsAllColumns = [
    { header: 'Name', accessorFn: nameAccessor }, { header: 'Date of Birth', accessorKey: 'dob' }, { header: 'Weight (kg)', accessorKey: 'weight_kg' }, { header: 'District', accessorKey: 'DistrictName' }, { header: 'Block', accessorKey: 'BlockName' }, { header: 'Gram Panchayat (GP)', accessorKey: 'GPName' }, { header: 'Village', accessorKey: 'VillageName' }, { header: 'Father Name', accessorFn: husbandAccessor }, { header: 'Phone Number', accessorFn: contactAccessor }, { header: 'ICDS Centre', accessorFn: icdsNameAccessor }, { header: 'ICDS Code', accessorFn: icdsCodeAccessor }, { header: 'Health Centre', accessorFn: healthNameAccessor }, { header: 'Health ID', accessorKey: 'HMID' }
  ];
  const anemicAdolescentGirlsMainColumns = [
    { header: 'Name', accessorFn: nameAccessor }, { header: 'Date of Birth', accessorKey: 'dob' }, { header: 'Weight (kg)', accessorKey: 'weight_kg' }, { header: 'Gram Panchayat (GP)', accessorKey: 'GPName' }, { header: 'Health Centre', accessorFn: healthNameAccessor }
  ];

  // 4. Infectious Diseases (Unique: disease, patient_name)
  const infectiousDiseasesAllColumns = [
    { header: 'Disease', accessorKey: 'disease' }, { header: 'Patient Name', accessorFn: nameAccessor }, { header: 'District', accessorKey: 'DistrictName' }, { header: 'Block', accessorKey: 'BlockName' }, { header: 'Gram Panchayat (GP)', accessorKey: 'GPName' }, { header: 'Village', accessorKey: 'VillageName' }, { header: 'Phone Number', accessorFn: contactAccessor }, { header: 'ICDS Centre', accessorFn: icdsNameAccessor }, { header: 'ICDS Code', accessorFn: icdsCodeAccessor }, { header: 'Health Centre', accessorFn: healthNameAccessor }, { header: 'Health ID', accessorKey: 'HMID' }
  ];
  const infectiousDiseasesMainColumns = [
    { header: 'Disease', accessorKey: 'disease' }, { header: 'Patient Name', accessorFn: nameAccessor }, { header: 'Gram Panchayat (GP)', accessorKey: 'GPName' }, { header: 'Village', accessorKey: 'VillageName' }, { header: 'Health Centre', accessorFn: healthNameAccessor }
  ];

  // 5. TB & Leprosy (Simpler Structure)
  const tbLeprosyAllColumns = [
    { header: 'Patient Name', accessorFn: nameAccessor }, { header: 'District', accessorKey: 'DistrictName' }, { header: 'Block', accessorKey: 'BlockName' }, { header: 'Gram Panchayat (GP)', accessorKey: 'GPName' }, { header: 'Village', accessorKey: 'VillageName' }, { header: 'Phone Number', accessorFn: contactAccessor }, { header: 'ICDS Centre', accessorFn: icdsNameAccessor }, { header: 'ICDS Code', accessorFn: icdsCodeAccessor }, { header: 'Health Centre', accessorFn: healthNameAccessor }, { header: 'Health ID', accessorKey: 'HMID' }
  ];
  const tbLeprosyMainColumns = [
    { header: 'Patient Name', accessorFn: nameAccessor }, { header: 'Village', accessorKey: 'VillageName' }, { header: 'Phone Number', accessorFn: contactAccessor }, { header: 'ICDS Centre', accessorFn: icdsNameAccessor },
  ];

  // 6. ICDS Centre Info (Unique Informational Structure)
  const icdsCentreAllColumns = [
    { header: 'AWC Name', accessorKey: 'AWCName' }, { header: 'AWC Code', accessorKey: 'AWCNo' }, { header: 'GP Name', accessorKey: 'GPName' }, { header: 'Block Name', accessorKey: 'BlockName' }, { header: 'Village', accessorKey: 'VillageName' }, { header: 'AWW Name', accessorKey: 'AWWName' }, { header: 'AWW Contact', accessorKey: 'AWWContactNo' }, { header: 'AWH Name', accessorKey: 'AWHName' }, { header: 'AWH Contact', accessorKey: 'AWHContactNo' }, { header: 'Ownership', accessorKey: 'OwnerShipTypeName' }, { header: 'Kitchen?', accessorKey: 'IsKitchenAvailable' }, { header: 'Toilet?', accessorKey: 'IsToiletAvailable' },
  ];
  const icdsCentreMainColumns = [
    { header: 'AWC Name', accessorKey: 'AWCName' }, { header: 'AWC Code', accessorKey: 'AWCNo' }, { header: 'GP Name', accessorKey: 'GPName' }, { header: 'AWW Name', accessorKey: 'AWWName' }, { header: 'AWW Contact', accessorKey: 'AWWContactNo' },
  ];

  // 7. Health Centre Info (Unique Informational Structure)
  const healthCentreAllColumns = [
    { header: 'Health Centre', accessorKey: 'HealthCentreName' }, { header: 'Health Centre Code', accessorKey: 'HealthCentreCodeNo' }, { header: 'GP Name', accessorKey: 'GPName' }, { header: 'Block Name', accessorKey: 'BlockName' }, { header: 'ANM Name', accessorKey: 'ANMName' }, { header: 'ANM Contact', accessorKey: 'ANMContactNo' }, { header: 'CHO Name', accessorKey: 'CHOName' }, { header: 'CHO Contact', accessorKey: 'CHOContactNo' }, { header: 'Ownership', accessorKey: 'OwnerShipTypeName' }, { header: 'Power?', accessorKey: 'IsPowerSupplyAvailable' }, { header: 'Water?', accessorKey: 'IsWaterSupplyAvailable' }, { header: 'Internet?', accessorKey: 'IsInternetAvailable' }, { header: 'Toilet?', accessorKey: 'IsToiletAvailable' },
  ];
  const healthCentreMainColumns = [
    { header: 'Health Centre', accessorKey: 'HealthCentreName' }, { header: 'Health Centre Code', accessorKey: 'HealthCentreCodeNo' }, { header: 'GP Name', accessorKey: 'GPName' }, { header: 'ANM Name', accessorKey: 'ANMName' }, { header: 'CHO Name', accessorKey: 'CHOName' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <FilterSection onFilter={handleFilter} onExport={handleGlobalExport} />
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6" role="alert">{error}</div>}
        <MetricsSection data={metricsData} isLoading={isLoading} />

        <div className="space-y-8 mt-8">
          <ReportSection title="Childbirths (Non-Institutional)" data={reportData?.childbirths_last_month || []} mainColumns={motherMainColumns} allColumns={motherAllColumns} isLoading={isLoading} />
          <ReportSection title="Under Age Marriages" data={reportData?.marriages_under_age || []} mainColumns={motherMainColumns} allColumns={motherAllColumns} isLoading={isLoading} />
          <ReportSection title="Children with Low Birth Weight" data={reportData?.children_low_birth_weight || []} mainColumns={childMainColumns} allColumns={childAllColumns} isLoading={isLoading} />
          <ReportSection title="Incomplete Immunization" data={reportData?.no_immunization || []} mainColumns={motherMainColumns} allColumns={motherAllColumns} isLoading={isLoading} />
          <ReportSection title="Under 20 Pregnant Mothers" data={reportData?.under_20_pregnant || []} mainColumns={motherMainColumns} allColumns={motherAllColumns} isLoading={isLoading} />
          <ReportSection title="Teenage Pregnancy Registered" data={reportData?.teenage_pregnancy || []} mainColumns={motherMainColumns} allColumns={motherAllColumns} isLoading={isLoading} />
          <ReportSection title="High-Risk Pregnancies" data={reportData?.high_risk_pregnancy || []} mainColumns={motherMainColumns} allColumns={motherAllColumns} isLoading={isLoading} />
          <ReportSection title="Malnourished Children" data={reportData?.malnourished_children || []} mainColumns={childMainColumns} allColumns={childAllColumns} isLoading={isLoading} />
          <ReportSection title="Severely Underweight Children" data={reportData?.severely_underweight || []} mainColumns={childMainColumns} allColumns={childAllColumns} isLoading={isLoading} />
          <ReportSection title="Anemic Adolescent Girls" data={reportData?.anemic_adolescent_girls || []} mainColumns={anemicAdolescentGirlsMainColumns} allColumns={anemicAdolescentGirlsAllColumns} isLoading={isLoading} />
          <ReportSection title="Infectious Diseases" data={reportData?.infectious_diseases || []} mainColumns={infectiousDiseasesMainColumns} allColumns={infectiousDiseasesAllColumns} isLoading={isLoading} />
          <ReportSection title="TB and Leprosy Patients" data={reportData?.tb_leprosy || []} mainColumns={tbLeprosyMainColumns} allColumns={tbLeprosyAllColumns} isLoading={isLoading} />
          <ReportSection title="ICDS Centre Information" data={reportData?.icds_center_info || []} mainColumns={icdsCentreMainColumns} allColumns={icdsCentreAllColumns} isLoading={isLoading} />
          <ReportSection title="Health Centre Information" data={reportData?.health_center_info || []} mainColumns={healthCentreMainColumns} allColumns={healthCentreAllColumns} isLoading={isLoading} />
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Health Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}