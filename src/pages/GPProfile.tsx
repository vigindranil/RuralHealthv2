import React, { useState, useEffect } from 'react';
import {
  User, MapPin, Phone, Users, UserCheck, UserCog, Building, HeartPulse, Loader2, AlertCircle, Lock
} from 'lucide-react';
import Cookies from 'js-cookie';
import { decodeJwtToken } from "../utils/decodetoken";
import { GpProfilePayload, saveGpProfile, getGpProfileInfo, GpProfileFetchParams } from '../api/dataEntry';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { useToast } from '../context/ToastContext';

interface GPProfileField {
  name: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  apiKey: string;
  type?: string;
}

interface FormData {
  [key: string]: string | number;
}

interface DecodedToken {
  UserTypeName?: string;
  UserID?: string | number;
  BoundaryID?: string | number;
  BoundaryLevelID?: string | number;
  UserFullName?: string;
}

// We add 'apiKey' to map form fields to API fields, and 'disabled' for non-editable fields
const GP_PROFILE_FIELDS: GPProfileField[] = [
  { name: 'gpName', label: 'GP Name', icon: <Building className="w-5 h-5 text-blue-500" />, disabled: true, apiKey: 'GPName' }, // GP Name from token, not editable
  { name: 'gpAddress', label: 'GP Address', icon: <MapPin className="w-5 h-5 text-green-500" />, apiKey: 'GPAddress' },
  { name: 'gpPradhanName', label: 'Pradhan Name', icon: <UserCheck className="w-5 h-5 text-yellow-500" />, apiKey: 'ProdhanName' },
  { name: 'gpPradhanContact', label: 'Pradhan Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" />, apiKey: 'ProdhanContactNo' },
  { name: 'gpSecretaryName', label: 'Secretary Name', icon: <User className="w-5 h-5 text-purple-500" />, apiKey: 'SecretaryName' },
  { name: 'gpSecretaryContact', label: 'Secretary Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" />, apiKey: 'SecretaryContactNo' },
  { name: 'executiveOfficerName', label: 'Executive Officer Name', icon: <UserCog className="w-5 h-5 text-pink-500" />, apiKey: 'ExecutiveName' },
  { name: 'executiveOfficerContact', label: 'Executive Officer Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" />, apiKey: 'ExecutiveContactNo' },
  { name: 'totalPopulation', label: 'Total Population', type: 'number', icon: <Users className="w-5 h-5 text-blue-700" />, apiKey: 'TotalPopulationQty' },
  { name: 'malePopulation', label: 'Male Population', type: 'number', icon: <User className="w-5 h-5 text-blue-500" />, apiKey: 'MalePopulationQty' },
  { name: 'femalePopulation', label: 'Female Population', type: 'number', icon: <User className="w-5 h-5 text-pink-400" />, apiKey: 'FemalePopulationQty' },
  { name: 'totalICDSCentre', label: 'Total ICDS Centres', type: 'number', icon: <HeartPulse className="w-5 h-5 text-red-400" />, apiKey: 'TotalICDSCentreQty' },
  { name: 'totalHealthCentre', label: 'Total Health Centres', type: 'number', icon: <HeartPulse className="w-5 h-5 text-green-400" />, apiKey: 'TotalHealthCentreQty' },
];

export default function GPProfile(): JSX.Element {
  // State for form data, loading, and errors
  const [form, setForm] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  // Toast hook
  const { showToast } = useToast();

  // Decode token to get user information needed for the API call
  const token = Cookies.get('authToken');
  const decodedToken: DecodedToken | null = decodeJwtToken(token);
  const role = decodedToken?.UserTypeName;
  const userId = decodedToken?.UserID;
  const boundaryId = decodedToken?.BoundaryID; // This is the GPID
  const boundaryLevelId = decodedToken?.BoundaryLevelID;
  const gpNameFromToken = decodedToken?.UserFullName; // Assuming GP name is in the token

  // Fetch initial profile data when the component loads
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchGpProfile = async () => {
      if (!boundaryId || !userId || !boundaryLevelId) {
        setError('Missing required user information from token.');
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        setError(null);

        const params: GpProfileFetchParams = {
          BoundaryLevelID: boundaryLevelId.toString(),
          BoundaryID: boundaryId.toString(),
          UserID: userId.toString(),
          FromDate: null,
          ToDate: null,
        };

        const response = await getGpProfileInfo(params);

        if (response.data && response.data.length > 0) {
          const profileData = response.data[0];

          // Map API response to form fields
          const mappedFormData: FormData = {
            gpName: profileData.GPName || gpNameFromToken, // Use API data if available, fallback to token
            gpAddress: profileData.GPAddress || '',
            gpPradhanName: profileData.ProdhanName || '',
            gpPradhanContact: profileData.ProdhanContactNo || '',
            gpSecretaryName: profileData.SecretaryName || '',
            gpSecretaryContact: profileData.SecretaryContactNo || '',
            executiveOfficerName: profileData.ExecutiveName || '',
            executiveOfficerContact: profileData.ExecutiveContactNo || '',
            totalPopulation: profileData.TotalPopulationQty || 0,
            malePopulation: profileData.MalePopulationQty || 0,
            femalePopulation: profileData.FemalePopulationQty || 0,
            totalICDSCentre: profileData.TotalICDSCentreQty || 0,
            totalHealthCentre: profileData.TotalHealthCentreQty || 0,
          };

          setForm(mappedFormData);
        } else {
          // If no data found, initialize with token data
          setForm({ gpName: gpNameFromToken || '' });
        }
      } catch (err: any) {
        console.error('Error fetching GP profile:', err);
        setError(err.message || 'Failed to fetch GP profile information.');
        // Set default form data even if fetch fails
        setForm({ gpName: gpNameFromToken || '' });
      } finally {
        setIsFetching(false);
      }
    };

    fetchGpProfile();
  }, [boundaryId, userId, boundaryLevelId, gpNameFromToken]);

  // Role-based access control
  if (role !== 'GPAdmin' && role !== 'District Admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-red-600 bg-red-50 rounded-lg shadow-md font-bold text-center">
          <AlertCircle className="mx-auto w-12 h-12 mb-4" />
          Access Denied. You do not have permission to edit this profile.
        </div>
      </div>
    );
  }

  // Show loading state while fetching data
  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-blue-600 bg-blue-50 rounded-lg shadow-md font-bold text-center">
          <Loader2 className="mx-auto w-12 h-12 mb-4 animate-spin" />
          Loading GP Profile...
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    // Construct the payload with keys the API expects
    const payload: GpProfilePayload = {
      GPID: boundaryId as number,
      EntryUserID: userId as number,
      GPAddress: form.gpAddress as string || "",
      ProdhanName: form.gpPradhanName as string || "",
      ProdhanContactNo: form.gpPradhanContact as string || "",
      SecretaryName: form.gpSecretaryName as string || "",
      SecretaryContactNo: form.gpSecretaryContact as string || "",
      ExecutiveOfficerName: form.executiveOfficerName as string || "",
      ExecutiveOfficerContactNo: form.executiveOfficerContact as string || "",
      TotalPopulationQty: form.totalPopulation as number || 0,
      MalePopulationQty: form.malePopulation as number || 0,
      FemalePopulationQty: form.femalePopulation as number || 0,
      TotalICDSCentresQty: form.totalICDSCentre as number || 0,
      TotalHealthCentresQty: form.totalHealthCentre as number || 0,
    };

    try {
      await saveGpProfile(payload);
      showToast('GP Profile updated successfully!', 'success');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password modal handlers
  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-8 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-green-400 rounded-full p-4 shadow-lg border-4 border-white">
            <Building className="w-12 h-12 text-white" />
          </div>

          {/* Change Password Button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={openPasswordModal}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </div>

          <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center mt-8">Edit Gram Panchayat Profile</h2>
          <p className="text-blue-500 text-center mb-8">Keep your GP information up to date for better communication and reporting.</p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {GP_PROFILE_FIELDS.map((field: GPProfileField) => (
                <div key={field.name} className="flex flex-col">
                  <label className="flex items-center gap-2 font-semibold text-blue-800 mb-1">
                    {field.icon}
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={form[field.name] ?? ''}
                    onChange={handleChange}
                    disabled={isLoading || field.disabled}
                    className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-blue-900 font-medium placeholder:text-blue-300 transition disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
                    placeholder={field.label}
                    autoComplete="off"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              {/* Error Message Display */}
              {error && (
                <div className="flex items-center gap-3 text-red-700 bg-red-100 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-green-600 transition flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
      />
    </>
  );
}