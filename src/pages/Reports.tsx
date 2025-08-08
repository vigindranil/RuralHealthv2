import { useState, useEffect, useCallback } from 'react';
import DataTable from '../components/DataTable';
import FilterSection from '../components/FilterSection';
import MetricsSection from '../components/MetricsSection'; // Ensure this path is correct
import { fetchGpProfileReport, ReportFilters } from '../api/reportsApi'; // Ensu.re path is correct

// A generic wrapper for each table to include title and export button
const TableWrapper = ({ title, onExport, children }: { title: string, onExport: () => void, children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <button onClick={onExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-semibold">
        Export to Excel
      </button>
    </div>
    {children}
  </div>
);

export default function WorkInProgress() {
  const [metricsData, setMetricsData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This function now handles the API call with the correct filters.
  const loadReportData = useCallback(async (filters: ReportFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchGpProfileReport(filters);
      setMetricsData(data.health_metrics_overview);
      setReportData(data.sections);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setMetricsData(null); // Clear old data on error
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On initial component mount, fetch data with no date filters.
  useEffect(() => {
    const initialFilters: ReportFilters = {
      fromDate: null,
      toDate: null,
      block: 'ALL',
      gp: 'ALL'
    };
    loadReportData(initialFilters);
  }, [loadReportData]);

  // This function is called by FilterSection when the user clicks "Submit".
  const handleFilter = (filters: ReportFilters) => {
    console.log('Applying new filters to fetch report:', filters);
    loadReportData(filters);
  };

  const handleGlobalExport = () => alert('Global Export functionality would be implemented here');
  const handleExportTable = (tableName: string) => alert(`Exporting "${tableName}" to Excel...`);

  // --- Column Definitions (Unchanged from your original code) ---
  const motherColumns = [{ header: 'Name', accessorKey: 'name' }, { header: 'District', accessorKey: 'district' }, { header: 'Block', accessorKey: 'block' }, { header: 'Gram Panchayat (GP)', accessorKey: 'gp' }, { header: 'Village Name', accessorKey: 'village' }, { header: 'Husband Name', accessorKey: 'husband_name' }, { header: 'Phone Number', accessorKey: 'phone_number' }, { header: 'ICDS Centre Name', accessorKey: 'icds_center_name' }, { header: 'ICDS Centre ID', accessorKey: 'icds_code' }, { header: 'Health Centre Name', accessorKey: 'health_center_name' }];
  const childColumns = [{ header: 'Name', accessorKey: 'name' }, { header: 'District', accessorKey: 'district' }, { header: 'Block', accessorKey: 'block' }, { header: 'Gram Panchayat (GP)', accessorKey: 'gp' }, { header: 'Village Name', accessorKey: 'village' }, { header: "Father's Name", accessorKey: 'father_name' }, { header: 'Phone Number', accessorKey: 'phone_number' }, { header: 'ICDS Centre Name', accessorKey: 'icds_center_name' }, { header: 'ICDS Centre ID', accessorKey: 'icds_code' }, { header: 'Health Centre Name', accessorKey: 'health_center_name' }];
  const infectiousDiseaseColumns = [{ header: 'Infectious Disease', accessorKey: 'disease' }, { header: 'Affected Person Name', accessorKey: 'patient_name' }, { header: 'Gram Panchayat (GP)', accessorKey: 'gp' }, { header: 'Village Name', accessorKey: 'village' }, { header: 'Contact No', accessorKey: 'phone_number' }, { header: 'ICDS Centre Name', accessorKey: 'icds_center_name' }, { header: 'Health Centre Name', accessorKey: 'health_center_name' }];
  const tbLeprosyColumns = [{ header: 'Patient Name', accessorKey: 'name' }, { header: 'Village Name', accessorKey: 'village' }, { header: 'Contact No', accessorKey: 'phone_number' }, { header: 'ICDS Centre Name', accessorKey: 'icds_center_name' }, { header: 'Health Centre Name', accessorKey: 'health_center_name' }];
  const adolescentGirlsColumns = [{ header: 'Name', accessorKey: 'name' }, { header: 'Date of Birth', accessorKey: 'dob' }, { header: 'Weight (kg)', accessorKey: 'weight_kg' }, { header: 'Gram Panchayat (GP)', accessorKey: 'gp' }, { header: 'Village Name', accessorKey: 'village' }, { header: "Father's Name", accessorKey: 'father_name' }, { header: 'Contact No', accessorKey: 'phone_number' }, { header: 'ICDS Centre Name', accessorKey: 'icds_center_name' }, { header: 'Health Centre Name', accessorKey: 'health_center_name' }];
  const icdsCentreColumns = [{ header: 'Anganwadi Center Code', accessorKey: 'code' }, { header: 'Anganwadi Center Name', accessorKey: 'center_name' }, { header: 'Village Name', accessorKey: 'village' }, { header: 'AWW Name', accessorKey: 'aww_name' }, { header: 'ASH Name', accessorKey: 'ash_name' }, { header: 'ASH Contact', accessorKey: 'ash_phone' }, { header: 'Location / Venue Name', accessorKey: 'location' }];
  const healthCentreColumns = [{ header: 'Health Centre Code', accessorKey: 'code' }, { header: 'Health Centre Name', accessorKey: 'center_name' }, { header: 'ANM Name', accessorKey: 'anm_name' }, { header: 'ANM Contact', accessorKey: 'anm_number' }, { header: 'CHO Name', accessorKey: 'cho_name' }, { header: 'CHO Contact', accessorKey: 'cho_number' }, { header: 'Sub-Centre Location', accessorKey: 'location' }];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <FilterSection onFilter={handleFilter} onExport={handleGlobalExport} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Pass live data and loading state to MetricsSection */}
        <MetricsSection data={metricsData} isLoading={isLoading} />

        <div className="space-y-8 mt-8">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Mother & Child Information</h2>
            <div className="space-y-10">
              <TableWrapper title="Childbirths (Last One Month) - Only Non-Institutional Births" onExport={() => handleExportTable('Childbirths (Non-Institutional)')}><DataTable columns={motherColumns} data={reportData?.childbirths_last_month || []} isLoading={isLoading} /></TableWrapper>
              <TableWrapper title="Marriages - Under Age" onExport={() => handleExportTable('Under Age Marriages')}><DataTable columns={motherColumns} data={reportData?.marriages_under_age || []} isLoading={isLoading} /></TableWrapper>
              <TableWrapper title="Children with Low Birth Weight" onExport={() => handleExportTable('Low Birth Weight Children')}><DataTable columns={childColumns} data={reportData?.children_low_birth_weight || []} isLoading={isLoading} /></TableWrapper>
              <TableWrapper title="Children who have not Completed Immunization" onExport={() => handleExportTable('Incomplete Immunization')}><DataTable columns={motherColumns} data={reportData?.no_immunization || []} isLoading={isLoading} /></TableWrapper>
              <TableWrapper title="Under 20 Years of Age Pregnant Mothers" onExport={() => handleExportTable('Young Pregnant Mothers')}><DataTable columns={motherColumns} data={reportData?.under_20_pregnant || []} isLoading={isLoading} /></TableWrapper>
              <TableWrapper title="Teenage Pregnancy Registered" onExport={() => handleExportTable('Teenage Pregnancy')}><DataTable columns={motherColumns} data={reportData?.teenage_pregnancy || []} isLoading={isLoading} /></TableWrapper>
              <TableWrapper title="Pregnant Women with High-Risk Pregnancy" onExport={() => handleExportTable('High-Risk Pregnancy')}><DataTable columns={motherColumns} data={reportData?.high_risk_pregnancy || []} isLoading={isLoading} /></TableWrapper>
              <TableWrapper title="Malnourished Children" onExport={() => handleExportTable('Malnourished Children')}><DataTable columns={childColumns} data={reportData?.malnourished_children || []} isLoading={isLoading} /></TableWrapper>
              <TableWrapper title="Severely Underweight Children" onExport={() => handleExportTable('Severely Underweight Children')}><DataTable columns={childColumns} data={reportData?.severely_underweight || []} isLoading={isLoading} /></TableWrapper>
            </div>
          </div>
          <TableWrapper title="Infectious Diseases" onExport={() => handleExportTable('Infectious Diseases')}><DataTable columns={infectiousDiseaseColumns} data={reportData?.infectious_diseases || []} isLoading={isLoading} /></TableWrapper>
          <TableWrapper title="TB and Leprosy Patients" onExport={() => handleExportTable('TB and Leprosy Patients')}><DataTable columns={tbLeprosyColumns} data={reportData?.tb_leprosy || []} isLoading={isLoading} /></TableWrapper>
          <TableWrapper title="Adolescent Girls who are Anemic" onExport={() => handleExportTable('Adolescent Girls (Anemic)')}><DataTable columns={adolescentGirlsColumns} data={reportData?.anemic_adolescent_girls || []} isLoading={isLoading} /></TableWrapper>
          <TableWrapper title="ICDS Centre Information" onExport={() => handleExportTable('ICDS Centre Information')}><DataTable columns={icdsCentreColumns} data={reportData?.icds_center_info || []} isLoading={isLoading} /></TableWrapper>
          <TableWrapper title="Health Centre Information" onExport={() => handleExportTable('Health Centre Information')}><DataTable columns={healthCentreColumns} data={reportData?.health_center_info || []} isLoading={isLoading} /></TableWrapper>
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