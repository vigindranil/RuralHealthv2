import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Building, Hash, User, Phone, MapPin, Home, ClipboardList, FileText, CheckCircle, MessageCircle
} from 'lucide-react';

const ICDS_FIELDS = [

  { name: 'amvcNumber', label: 'Anganwadi Center Number (AMVC NO.)', icon: <ClipboardList className="w-5 h-5 text-green-500" /> },
  { name: 'centerCode', label: 'Anganwadi Center Name', icon: <Hash className="w-5 h-5 text-purple-500" /> },

  { name: 'awwName', label: 'AWW Name', icon: <User className="w-5 h-5 text-blue-700" /> },
  { name: 'awwContact', label: 'AWW Contact', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'awhName', label: 'AWH Name', icon: <User className="w-5 h-5 text-pink-500" /> },
  { name: 'awhContact', label: 'AWH Contact', icon: <Phone className="w-5 h-5 text-pink-400" /> },
  { name: 'awcLocation', label: 'AWC Location / Building / Camp / Venue Name', icon: <Home className="w-5 h-5 text-yellow-500" /> },
  { name: 'landOwnerContact', label: 'Contact Number of Land Owner / Local Contact Person', icon: <Phone className="w-5 h-5 text-blue-400" /> },
  { name: 'landOwnerName', label: 'Name of Land Owner / Local Contact / Building Owner', icon: <User className="w-5 h-5 text-green-700" /> },
  { name: 'landOwnerAddress', label: 'Address of Land Owner / Local Contact / Building Owner', icon: <MapPin className="w-5 h-5 text-blue-500" /> },
  { name: 'ownershipType', label: 'Ownership Type (OWN / RENTED)', type: 'select', options: ['OWN', 'RENTED'], icon: <FileText className="w-5 h-5 text-purple-500" /> },
  { name: 'kitchenAvailability', label: 'Kitchen Availability', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { name: 'storeRoomAvailability', label: 'Store Room Availability', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { name: 'toiletAvailability', label: 'Toilet Availability', type: 'select', options: ['Yes', 'No'], icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
  { name: 'remarks', label: 'Additional Remarks', icon: <MessageCircle className="w-5 h-5 text-blue-400" /> },
];

export default function ICDSDataEntry() {
  const { user } = useAuth();
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);

  if (!user || user.role !== 'GP') {
    return (
      <div className="p-8 text-red-600 font-bold text-center">
        Access denied. Only GP users can enter ICDS Centre data.
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
    console.log('ICDS Data Entry:', form);
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
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center mt-8">ICDS Centre Data Entry</h2>
        <p className="text-blue-500 text-center mb-8">Enter details for your Anganwadi/ICDS Centre below.</p>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ICDS_FIELDS.map(field => (
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