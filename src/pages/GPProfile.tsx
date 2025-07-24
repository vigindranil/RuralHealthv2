import React, { useState, useEffect } from 'react';
import {
  User, MapPin, Phone, Users, UserCheck, UserCog, Building, HeartPulse, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import Cookies from 'js-cookie';
import { decodeJwtToken } from "../utils/decodetoken";
import { GpProfilePayload, saveGpProfile } from '../api/dataEntry';

// We add 'apiKey' to map form fields to API fields, and 'disabled' for non-editable fields
const GP_PROFILE_FIELDS = [
  { name: 'gpName', label: 'GP Name', icon: <Building className="w-5 h-5 text-blue-500" />, disabled: true, apiKey: 'GPName' }, // GP Name from token, not editable
  { name: 'gpAddress', label: 'GP Address', icon: <MapPin className="w-5 h-5 text-green-500" />, apiKey: 'GPAddress' },
  { name: 'gpPradhanName', label: 'Pradhan Name', icon: <UserCheck className="w-5 h-5 text-yellow-500" />, apiKey: 'ProdhanName' },
  { name: 'gpPradhanContact', label: 'Pradhan Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" />, apiKey: 'ProdhanContactNo' },
  { name: 'gpSecretaryName', label: 'Secretary Name', icon: <User className="w-5 h-5 text-purple-500" />, apiKey: 'SecretaryName' },
  { name: 'gpSecretaryContact', label: 'Secretary Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" />, apiKey: 'SecretaryContactNo' },
  { name: 'executiveOfficerName', label: 'Executive Officer Name', icon: <UserCog className="w-5 h-5 text-pink-500" />, apiKey: 'ExecutiveOfficerName' },
  { name: 'executiveOfficerContact', label: 'Executive Officer Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" />, apiKey: 'ExecutiveOfficerContactNo' },
  { name: 'totalPopulation', label: 'Total Population', type: 'number', icon: <Users className="w-5 h-5 text-blue-700" />, apiKey: 'TotalPopulationQty' },
  { name: 'malePopulation', label: 'Male Population', type: 'number', icon: <User className="w-5 h-5 text-blue-500" />, apiKey: 'MalePopulationQty' },
  { name: 'femalePopulation', label: 'Female Population', type: 'number', icon: <User className="w-5 h-5 text-pink-400" />, apiKey: 'FemalePopulationQty' },
  { name: 'totalICDSCentre', label: 'Total ICDS Centres', type: 'number', icon: <HeartPulse className="w-5 h-5 text-red-400" />, apiKey: 'TotalICDSCentresQty' },
  { name: 'totalHealthCentre', label: 'Total Health Centres', type: 'number', icon: <HeartPulse className="w-5 h-5 text-green-400" />, apiKey: 'TotalHealthCentresQty' },
];

export default function GPProfile() {
  // State for form data, loading, errors, and success messages
  const [form, setForm] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Decode token to get user information needed for the API call
  const token = Cookies.get('authToken');
  const decodedToken = decodeJwtToken(token);
  const role = decodedToken?.UserTypeName;
  const userId = decodedToken?.UserID;
  const boundaryId = decodedToken?.BoundaryID; // This is the GPID
  const gpNameFromToken = decodedToken?.UserFullName; // Assuming GP name is in the token

  // Fetch initial profile data when the component loads
  useEffect(() => {
    // For now, just set the non-editable GP name
    setForm({ gpName: gpNameFromToken });

  }, [boundaryId, gpNameFromToken]); // Re-run if these values change

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Construct the payload with keys the API expects
    const payload: GpProfilePayload = {
      GPID: boundaryId,
      EntryUserID: userId,
      GPAddress: form.gpAddress || "",
      ProdhanName: form.gpPradhanName || "",
      ProdhanContactNo: form.gpPradhanContact || "",
      SecretaryName: form.gpSecretaryName || "",
      SecretaryContactNo: form.gpSecretaryContact || "",
      ExecutiveOfficerName: form.executiveOfficerName || "",
      ExecutiveOfficerContactNo: form.executiveOfficerContact || "",
      TotalPopulationQty: form.totalPopulation || 0,
      MalePopulationQty: form.malePopulation || 0,
      FemalePopulationQty: form.femalePopulation || 0,
      TotalICDSCentresQty: form.totalICDSCentre || 0,
      TotalHealthCentresQty: form.totalHealthCentre || 0,
    };

    try {
      await saveGpProfile(payload);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 4000); // Message disappears after 4 seconds
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-8 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-green-400 rounded-full p-4 shadow-lg border-4 border-white">
          <Building className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center mt-8">Edit Gram Panchayat Profile</h2>
        <p className="text-blue-500 text-center mb-8">Keep your GP information up to date for better communication and reporting.</p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {GP_PROFILE_FIELDS.map(field => (
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
            {/* Success and Error Message Display */}
            {success && (
              <div className="flex items-center gap-3 text-green-700 bg-green-100 p-3 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">{success}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 text-red-700 bg-red-100 p-3 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <button
              type="submit"
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
        </form>
      </div>
    </div>
  );
}