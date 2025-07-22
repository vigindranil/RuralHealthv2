import React, { useState } from 'react';
import { getUser, setUser as updateUser } from '../utils/authUtils'; // Import hardcoded user utils (replaces AuthContext)
import {
  User, MapPin, Phone, Users, UserCheck, UserCog, Building, HeartPulse
} from 'lucide-react';

const GP_PROFILE_FIELDS = [
  { name: 'gpName', label: 'GP Name', icon: <Building className="w-5 h-5 text-blue-500" /> },
  { name: 'gpAddress', label: 'GP Address', icon: <MapPin className="w-5 h-5 text-green-500" /> },
  { name: 'gpPradhanName', label: 'Pradhan Name', icon: <UserCheck className="w-5 h-5 text-yellow-500" /> },
  { name: 'gpPradhanContact', label: 'Pradhan Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'gpSecretaryName', label: 'Secretary Name', icon: <User className="w-5 h-5 text-purple-500" /> },
  { name: 'gpSecretaryContact', label: 'Secretary Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'executiveOfficerName', label: 'Executive Officer Name', icon: <UserCog className="w-5 h-5 text-pink-500" /> },
  { name: 'executiveOfficerContact', label: 'Executive Officer Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'totalPopulation', label: 'Total Population', type: 'number', icon: <Users className="w-5 h-5 text-blue-700" /> },
  { name: 'malePopulation', label: 'Male Population', type: 'number', icon: <User className="w-5 h-5 text-blue-500" /> },
  { name: 'femalePopulation', label: 'Female Population', type: 'number', icon: <User className="w-5 h-5 text-pink-400" /> },
  { name: 'totalICDSCentre', label: 'Total ICDS Centres', type: 'number', icon: <HeartPulse className="w-5 h-5 text-red-400" /> },
  { name: 'totalHealthCentre', label: 'Total Health Centres', type: 'number', icon: <HeartPulse className="w-5 h-5 text-green-400" /> },
];

export default function GPProfile() {
  // Use hardcoded user from utils (no context)
  const currentUser = getUser();
  const [form, setForm] = useState({ ...currentUser });
  const [success, setSuccess] = useState(false);

  if (!currentUser || currentUser.role !== 'GP') {
    return (
      <div className="p-8 text-red-600 font-bold text-center">
        Access denied. Only GP users can edit this profile.
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Update hardcoded user via utils
    updateUser({ ...currentUser, ...form });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-8 relative">
        {/* Floating Icon */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-green-400 rounded-full p-4 shadow-lg border-4 border-white">
          <Building className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center mt-8">Edit Gram Panchayat Profile</h2>
        <p className="text-blue-500 text-center mb-8">Keep your GP information up to date for better communication and reporting.</p>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-blue-900 font-medium placeholder:text-blue-300 transition"
                  placeholder={field.label}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-green-600 transition"
          >
            Save Changes
          </button>
          {success && (
            <div className="text-green-600 text-center font-semibold mt-2 animate-bounce">
              Profile updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
