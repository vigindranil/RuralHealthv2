import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Building, Hash, User, Phone, MapPin, Home, FileText, CheckCircle, MessageCircle, ClipboardList, Wifi
} from 'lucide-react';

const HEALTH_CENTRE_FIELDS = [

  { name: 'scCode', label: 'Health Centre (SC CODE NO.)', icon: <ClipboardList className="w-5 h-5 text-green-500" /> },
  { name: 'healthCentreName', label: 'Health Centre Name', icon: <Building className="w-5 h-5 text-blue-700" /> },
  { name: 'anmName', label: 'ANM Name', icon: <User className="w-5 h-5 text-purple-500" /> },
  { name: 'anmContact', label: 'ANM Contact Number', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'choName', label: 'CHO Name', icon: <User className="w-5 h-5 text-pink-500" /> },
  { name: 'choContact', label: 'CHO Contact Number', icon: <Phone className="w-5 h-5 text-pink-400" /> },
  { name: 'location', label: 'Sub-Centre Location / Building / Venue', icon: <Home className="w-5 h-5 text-yellow-500" /> },
  { name: 'landOwnerContact', label: 'Contact Number of Land Owner / Building Owner / Local Contact Person', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'landOwnerName', label: 'Name of Land Owner / Local Contact / Building Owner', icon: <User className="w-5 h-5 text-green-700" /> },
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

export default function HealthCentreDataEntry() {
  const { user } = useAuth();
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);

  if (!user || user.role !== 'GP') {
    return (
      <div className="p-8 text-red-600 font-bold text-center">
        Access denied. Only GP users can enter Health Centre data.
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend or context
    console.log('Health Centre Data Entry:', form);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    setForm({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-8 relative">
        {/* Floating Icon */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-green-400 rounded-full p-4 shadow-lg border-4 border-white">
          <Building className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center mt-8">Health Centre Data Entry</h2>
        <p className="text-blue-500 text-center mb-8">Enter details for your Health Centre or Sub-Centre below.</p>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HEALTH_CENTRE_FIELDS.map(field => (
              <div key={field.name} className="flex flex-col">
                <label className="flex items-center gap-2 font-semibold text-blue-800 mb-1">
                  {field.icon}
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={form[field.name] ?? ''}
                    onChange={handleChange}
                    className="border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-blue-900 font-medium transition"
                  >
                    <option value="">Select</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.name === 'remarks' ? (
                  <textarea
                    name={field.name}
                    value={form[field.name] ?? ''}
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
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-700 hover:to-green-600 transition"
          >
            Save Entry
          </button>
          {success && (
            <div className="text-green-600 text-center font-semibold mt-2 animate-bounce">
              Data saved successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}