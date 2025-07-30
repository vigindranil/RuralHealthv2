import React, { useState, useEffect, useMemo, useCallback, FC, ReactNode } from 'react';
import { getHealthCentreInfo } from '../api/fetchCall';
import {
  Building, Hash, User as UserIcon, Phone, MapPin, Home, ClipboardList, FileText, CheckCircle, MessageCircle, Plus, Minus, Search,
  ChevronLeft, ChevronRight, Wifi, Edit, XCircle,
  FlaskConical,
  HeartPulse,
  Pill,
  Users,
  PersonStanding,
  Power,
  Droplets
} from 'lucide-react';
import Cookies from 'js-cookie';
import { decodeJwtToken } from '../utils/decodetoken';
import { HealthCentrePayload, saveHealthCentreInfo } from '../api/dataEntry';
import { useToast } from '../context/ToastContext';

// --- TYPE DEFINITIONS ---

interface HealthCentreField {
  name: string;
  label: string;
  icon: ReactNode;
  type?: 'select' | string;
  options?: string[];
}

interface HealthCentre {
  HealthCentreID: number;
  GPID: number;
  GPName: string;
  BlockName: string;
  DistrictName: string;
  HealthCentreCodeNo: string;
  HealthCentreName: string;
  ANMName: string | null;
  ANMContactNo: string | null;
  CHOName: string | null;
  CHOContactNo: string | null;
  SCLocation: string | null;
  LandOwnerName: string | null;
  LandOwnerContactNo: string | null;
  LandOwnerAddress: string | null;
  OwnerShipTypeID: number | null;
  OwnerShipTypeName: string | null;
  IsExaminationRoomAvailable: number | null;
  IsLabRoomAvailable: number | null;
  IsMedicineStoreAvailable: number | null;
  IsWaitingAreaAvailable: number | null;
  IsToiletAvailable: number | null;
  IsPowerSupplyAvailable: number | null;
  IsWaterSupplyAvailable: number | null;
  IsInternetAvailable: number | null;
  Remarks: string;
}

interface AccordionItemProps {
  centre: HealthCentre;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (centre: HealthCentre) => void;
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DecodedToken {
  UserID: string;
}

type FormState = {
  [key: string]: string | number;
};


// --- CONSTANTS ---

const HEALTH_CENTRE_FIELDS: HealthCentreField[] = [
  { name: 'scCode', label: 'Health Centre (SC CODE NO.)', icon: <ClipboardList className="w-5 h-5 text-green-500" /> },
  { name: 'healthCentreName', label: 'Health Centre Name', icon: <Building className="w-5 h-5 text-blue-700" /> },
  { name: 'anmName', label: 'ANM Name', icon: <UserIcon className="w-5 h-5 text-purple-500" /> },
  { name: 'anmContact', label: 'ANM Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'choName', label: 'CHO Name', icon: <UserIcon className="w-5 h-5 text-pink-500" /> },
  { name: 'choContact', label: 'CHO Contact Number', icon: <Phone className="w-5 h-5 text-pink-400" /> },
  { name: 'location', label: 'Sub-Centre Location / Building / Venue', icon: <Home className="w-5 h-5 text-yellow-500" /> },
  { name: 'landOwnerContact', label: 'Contact Number of Land Owner / Building Owner / Local Contact Person', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'landOwnerName', label: 'Name of Land Owner / Local Contact / Building Owner', icon: <UserIcon className="w-5 h-5 text-green-700" /> },
  { name: 'landOwnerAddress', label: 'Address of Land Owner / Local Contact / Building Owner', icon: <MapPin className="w-5 h-5 text-blue-500" /> },
  { name: 'ownershipType', label: 'Ownership Type (OWN / RENTED / GOVT.)', type: 'select', options: ['OWN', 'RENTED', 'GOVT.'], icon: <FileText className="w-5 h-5 text-purple-500" /> },
  { name: 'examinationRoom', label: 'Examination Room', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { name: 'labRoom', label: 'Lab Room', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { name: 'medicineStore', label: 'Medicine Store', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { name: 'waitingArea', label: 'Waiting Area', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { name: 'toiletFacility', label: 'Toilet Facility', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { name: 'powerSupply', label: 'Power Supply', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-yellow-500" /> },
  { name: 'waterSupply', label: 'Water Supply', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-blue-500" /> },
  { name: 'internetConnectivity', label: 'Internet / Telemedicine Connectivity', type: 'select', options: ['Yes', 'No'], icon: <Wifi className="w-5 h-5 text-blue-400" /> },
  { name: 'remarks', label: 'Remarks / Special Notes', icon: <MessageCircle className="w-5 h-5 text-blue-400" /> },
];

// --- REUSABLE COMPONENTS ---

// MODIFICATION: Fixed the duplicated JSX block for facilities.
const AccordionItem: FC<AccordionItemProps> = React.memo(({ centre, isExpanded, onToggle, onEdit }) => {
  const facilityConfig = [
    { key: 'IsExaminationRoomAvailable', label: 'Exam Room', icon: <HeartPulse className="w-4 h-4 text-green-500" /> },
    { key: 'IsLabRoomAvailable', label: 'Lab Room', icon: <FlaskConical className="w-4 h-4 text-green-500" /> },
    { key: 'IsMedicineStoreAvailable', label: 'Med Store', icon: <Pill className="w-4 h-4 text-green-500" /> },
    { key: 'IsWaitingAreaAvailable', label: 'Wait Area', icon: <Users className="w-4 h-4 text-green-500" /> },
    { key: 'IsToiletAvailable', label: 'Toilet', icon: <PersonStanding className="w-4 h-4 text-green-500" /> },
    { key: 'IsPowerSupplyAvailable', label: 'Power', icon: <Power className="w-4 h-4 text-green-500" /> },
    { key: 'IsWaterSupplyAvailable', label: 'Water', icon: <Droplets className="w-4 h-4 text-green-500" /> },
    { key: 'IsInternetAvailable', label: 'Internet', icon: <Wifi className="w-4 h-4 text-green-500" /> },
  ];

  const availableFacilities = facilityConfig.filter(
    (facility) => centre[facility.key as keyof HealthCentre] === 1
  );
  return (
    <div className="mb-2 bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
      <div
        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-3 h-3 text-blue-600 flex-shrink-0" />
            <h3 className="font-medium text-blue-900 text-xs truncate">{centre.HealthCentreName || 'N/A'}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Hash className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{centre.HealthCentreCodeNo || 'N/A'}</span>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0">
          {isExpanded ? <Minus className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
        </div>
      </div>
      <div className={`transition-all duration-300 ease-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="px-3 pb-3 pt-3 border-t border-blue-100 bg-blue-50/30">
          <div className="space-y-2">
            <div className="bg-white rounded p-2 border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-1 text-xs">
                <MapPin className="w-3 h-3" /> Basic Info
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-600">GP:</span><span className="font-medium truncate ml-1">{centre.GPName || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Block:</span><span className="font-medium truncate ml-1">{centre.BlockName || 'N/A'}</span></div>
              </div>
            </div>
            <div className="bg-white rounded p-2 border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-1 text-xs">
                <Phone className="w-3 h-3" /> Contact
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-600">ANM:</span><span className="font-medium truncate ml-1">{centre.ANMName || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">CHO:</span><span className="font-medium truncate ml-1">{centre.CHOName || 'N/A'}</span></div>
              </div>
            </div>
            <div className="bg-white rounded p-2 border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-1 text-xs">
                <CheckCircle className="w-3 h-3" /> Available Facilities
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {availableFacilities.length > 0 ? (
                  availableFacilities.map(({ key, label, icon }) => (
                    <div key={key} className="flex items-center gap-2 text-gray-700">
                      {icon}
                      <span className="font-medium">{label}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-2 italic">No facilities listed.</p>
                )}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(centre);
                }}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const PaginationControls: FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 mt-auto border-t border-blue-100">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 transition">
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      <span className="text-sm font-medium text-blue-800">{currentPage} / {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-200 transition">
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};


// --- MAIN COMPONENT ---

export default function HealthCentreDataEntry() {
  const [form, setForm] = useState<FormState>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [healthCentreData, setHealthCentreData] = useState<HealthCentre[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCentreId, setEditingCentreId] = useState<number | null>(null);

  const ITEMS_PER_PAGE = 13;
  const { showToast } = useToast();

  const BoundaryLevelID = Cookies.get('boundaryLevelID');
  const BoundaryID = Cookies.get('boundaryID');
  const token = Cookies.get('authToken');
  const decoded: DecodedToken | null = token ? decodeJwtToken(token) : null;
  const userID = decoded?.UserID || '1';


  const fetchHealthCentreData = async () => {
    if (!BoundaryLevelID || !BoundaryID) {
      console.error("Boundary information not found in cookies.");
      setError("Boundary information not found. Please select a location.");
      showToast("Boundary information not found. Please select a location.", "error");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await getHealthCentreInfo(BoundaryLevelID, BoundaryID, userID, null, null);
      if (response && response.data) {
        setHealthCentreData(response.data);
      } else {
        setHealthCentreData([]);
      }
    } catch (error) {
      console.error('Error calling Health Centre Info API:', error);
      setError("Failed to load health centre data.");
      showToast("Failed to load health centre data.", "error");
      setHealthCentreData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback((centre: HealthCentre) => {
    setEditingCentreId(centre.HealthCentreID);

    const apiBooleanToFormString = (value: number | null): string => {
      if (value === 1) return 'Yes';
      if (value === 0) return 'No';
      return '';
    };

    const getOwnershipTypeNameFromId = (id: number | null): string => {
      switch (id) {
        case 1: return 'OWN';
        case 2: return 'RENTED';
        case 3: return 'GOVT.';
        default: return '';
      }
    };

    setForm({
      scCode: centre.HealthCentreCodeNo || '',
      healthCentreName: centre.HealthCentreName || '',
      anmName: centre.ANMName || '',
      anmContact: centre.ANMContactNo || '',
      choName: centre.CHOName || '',
      choContact: centre.CHOContactNo || '',
      location: centre.SCLocation || '',
      landOwnerContact: centre.LandOwnerContactNo || '',
      landOwnerName: centre.LandOwnerName || '',
      landOwnerAddress: centre.LandOwnerAddress || '',
      ownershipType: getOwnershipTypeNameFromId(centre.OwnerShipTypeID),
      examinationRoom: apiBooleanToFormString(centre.IsExaminationRoomAvailable),
      labRoom: apiBooleanToFormString(centre.IsLabRoomAvailable),
      medicineStore: apiBooleanToFormString(centre.IsMedicineStoreAvailable),
      waitingArea: apiBooleanToFormString(centre.IsWaitingAreaAvailable),
      toiletFacility: apiBooleanToFormString(centre.IsToiletAvailable),
      powerSupply: apiBooleanToFormString(centre.IsPowerSupplyAvailable),
      waterSupply: apiBooleanToFormString(centre.IsWaterSupplyAvailable),
      internetConnectivity: apiBooleanToFormString(centre.IsInternetAvailable),
      remarks: centre.Remarks || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = () => {
    setEditingCentreId(null);
    setForm({});
    setError(null);
    setSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!userID) {
      setError('User ID not found. Please log in again.');
      showToast('User ID not found. Please log in again.', 'error');
      return;
    }
    if (!form.healthCentreName) {
      setError("Health Centre Name is a required field.");
      showToast("Health Centre Name is a required field.", "error");
      return;
    }

    setIsSaving(true);

    const toApiBoolean = (value: any): string => (value === 'Yes' ? '1' : (value === 'No' ? '0' : ''));
    const getOwnershipTypeId = (value: any): string => {
      switch (value) {
        case 'OWN': return '1';
        case 'RENTED': return '2';
        case 'GOVT.': return '3';
        default: return '';
      }
    };

    const payload: HealthCentrePayload = {
      InHealthCentreID: String(editingCentreId || "0"),
      GPID: String(BoundaryID || ''),
      HealthCentreCodeNo: String(form.scCode || ''),
      HealthCentreName: String(form.healthCentreName || ''),
      ANMName: String(form.anmName || ''),
      ANMContactNo: String(form.anmContact || ''),
      CHOName: String(form.choName || ''),
      CHOContactNo: String(form.choContact || ''),
      SCLocation: String(form.location || ''),
      LandOwnerName: String(form.landOwnerName || ''),
      LandOwnerContactNo: String(form.landOwnerContact || ''),
      LandOwnerAddress: String(form.landOwnerAddress || ''),
      OwnerShipTypeID: getOwnershipTypeId(form.ownershipType),
      IsExaminationRoomAvailable: toApiBoolean(form.examinationRoom),
      IsLabRoomAvailable: toApiBoolean(form.labRoom),
      IsMedicineStoreAvailable: toApiBoolean(form.medicineStore),
      IsWaitingAreaAvailable: toApiBoolean(form.waitingArea),
      IsToiletAvailable: toApiBoolean(form.toiletFacility),
      IsPowerSupplyAvailable: toApiBoolean(form.powerSupply),
      IsWaterSupplyAvailable: toApiBoolean(form.waterSupply),
      IsInternetAvailable: toApiBoolean(form.internetConnectivity),
      Remarks: String(form.remarks || ''),
      EntryUserID: userID,
    };

    try {
      const response = await saveHealthCentreInfo(payload);
      if (response.status === 0) {
        setSuccess(true);
        const successMessage = editingCentreId ? 'Data updated successfully!' : 'Data saved successfully!';
        showToast(response.message || successMessage, 'success');
        handleCancelEdit();
        fetchHealthCentreData();
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(response.message || 'An unknown error occurred.');
        showToast(response.message || 'An unknown error occurred.', 'error');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Save failed:', err);
      showToast(err.message || 'An error occurred while saving data.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHealthCentreData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const filteredCentres = useMemo(() => {
    if (!searchTerm.trim()) return healthCentreData;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return healthCentreData.filter(centre =>
      centre.HealthCentreName?.toLowerCase().includes(lowercasedSearchTerm) ||
      centre.HealthCentreCodeNo?.toLowerCase().includes(lowercasedSearchTerm) ||
      centre.GPName?.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [healthCentreData, searchTerm]);

  const paginatedCentres = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCentres.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCentres, currentPage]);

  const totalPages = Math.ceil(filteredCentres.length / ITEMS_PER_PAGE);

  const toggleExpanded = useCallback((id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 py-10">
      <div className="max-w-7xl mx-auto px-4 flex gap-6">
        <div className="w-80 flex-shrink-0 hidden lg:flex flex-col">
          <div className="bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-4 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-full p-2">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">Existing Centres</h3>
                <p className="text-blue-500 text-sm">{filteredCentres.length} of {healthCentreData.length} centres</p>
              </div>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search centres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-sm"
              />
            </div>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-blue-600 text-sm">Loading...</span>
              </div>
            ) : filteredCentres.length > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto pr-1 space-y-1">
                  {paginatedCentres.map((centre) => (
                    <AccordionItem
                      key={centre.HealthCentreID}
                      centre={centre}
                      isExpanded={expandedItems.has(centre.HealthCentreID)}
                      onToggle={() => toggleExpanded(centre.HealthCentreID)}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
                <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 flex-1 flex flex-col justify-center">
                <Building className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No centres found</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-8 relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-green-400 rounded-full p-4 shadow-lg border-4 border-white">
                <Building className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center mt-8">
                {editingCentreId ? 'Edit Health Centre' : 'Health Centre Data Entry'}
              </h2>
              <p className="text-blue-500 text-center mb-8">
                {editingCentreId ? 'Update the details for this Health Centre.' : 'Enter details for a new Health Centre or Sub-Centre.'}
              </p>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {HEALTH_CENTRE_FIELDS.map(field => (
                    <div key={field.name} className="flex flex-col">
                      <label className="flex items-center gap-2 font-semibold text-blue-800 mb-1">
                        {field.icon} {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={form[field.name] ?? ''}
                          onChange={handleChange}
                          className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-blue-900 font-medium transition"
                        >
                          <option value="">Select</option>
                          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.name === 'remarks' ? (
                        <textarea
                          name={field.name}
                          value={(form[field.name] as string) ?? ''}
                          onChange={handleChange}
                          rows={2}
                          className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-blue-900 font-medium placeholder:text-blue-300 transition"
                          placeholder={field.label}
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.name}
                          value={form[field.name] ?? ''}
                          onChange={handleChange}
                          className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-blue-900 font-medium placeholder:text-blue-300 transition"
                          placeholder={field.label}
                          autoComplete="off"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {editingCentreId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full sm:w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-gray-300 transition flex items-center justify-center"
                    >
                      <XCircle className="w-6 h-6 mr-2" />
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-green-600 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Saving...
                      </>
                    ) : (
                      editingCentreId ? 'Update Entry' : 'Save New Entry'
                    )}
                  </button>
                </div>
                {success && (
                  <div className="text-green-600 text-center font-semibold mt-2 animate-bounce">
                    Data saved successfully!
                  </div>
                )}
                {error && (
                  <div className="text-red-600 text-center font-semibold mt-2">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}