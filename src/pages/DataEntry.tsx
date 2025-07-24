import React, { useState, useEffect } from "react";
import { FileText, Plus, Save, X, Building, User } from "lucide-react";
import FormModal from "../components/FormModal";
import { useNavigate } from "react-router-dom";
import { getDataEntries } from "../api/dataEntry";
import Cookies from 'js-cookie';
import { decodeJwtToken } from "../utils/decodetoken";

export default function DataEntry() {
  const token = Cookies.get('authToken');
  const decoded = decodeJwtToken(token);
  const role = decoded?.UserTypeName;

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataEntries = async () => {
      try {
        const data = await getDataEntries();
        console.log("Fetched data entries:", data); // Debug log
        setModules(data?.data || []);
      } catch (error) {
        console.error("Error fetching data entries:", error);
        setError("Error fetching data entries. Please try again later.");
      }
    };
    fetchDataEntries();
  }, []);

  // Module emoji mapping object
  const moduleEmojis: Record<string, string> = {
    "Childbirths (Last One Month) -  Only Non-Institutional Births": "👶",
    "Marriages -  Under Age": "💍",
    "Children with low birth weight": "⚖️",
    "Children who have not completed immunization": "💉",
    "Under 20 years of age pregnant mothers": "🤰",
    "Teenage pregrancy regutered": "📝",
    "Pregnant women with high-risk pregnancy": "⚠️🤰",
    "Malnourished Children": "🍚",
    "Severely Underweight children": "🧸📉",
    "Adolescent Girls who are Anemic": "🩸👧",
    "Infectious diseases in last one month": "🦠🤒",
    "TB and leprosy patients": "🫁🦠",
    default: "📄",
  };

  const handleModuleClick = (moduleId: string) => {
    // if (role !== "GPAdmin") return; // Early return if not authorized
    if (isModalOpen) return; // Prevent multiple modals from stacking
    console.log("Opening modal for module ID:", moduleId); // Debug log
    setSelectedModule(String(moduleId)); // Convert to string for FormModal compatibility
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Entry</h1>
        <p className="text-gray-600 mt-2">
          {role === "GPAdmin"
            ? "Select a module to enter new data"
            : "Data entry is restricted to GP users only"}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Access Notice for Non-GP Users */}
      {role !== "GPAdmin" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">
              Data entry is only available for GP (Gram Panchayat) users. You
              can view existing data and reports from the Dashboard and Reports
              sections.
            </p>
          </div>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules?.map((module) => (
          <div
            key={module.HMTypeID}
            onClick={() => handleModuleClick(module.HMTypeID)}
            className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border ${(role === "GPAdmin" || role === "DistrictAdmin")
              ? "cursor-pointer hover:border-blue-300"
              : "cursor-not-allowed opacity-60"
              }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">
                {moduleEmojis[module?.HMTypeName] || moduleEmojis.default}
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {module.count ?? 0} entries  {/* Fallback to 0 if undefined */}
                </span>
                {(role === "GPAdmin" || role === "DistrictAdmin") && (
                  <Plus className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {module?.HMTypeName}
            </h3>
            <p className="text-gray-600 text-sm">{module?.HMDescription || 'No description available'}</p>
          </div>
        ))}
        <div
          onClick={() => navigate("/icds-data-entry")}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border cursor-pointer hover:border-green-400"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">
              <Building className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                ICDS
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ICDS Centre Data Entry
          </h3>
          <p className="text-gray-600 text-sm">
            Enter or update details for your Anganwadi/ICDS Centre.
          </p>
        </div>

        <div
          onClick={() => navigate("/health-centre-data-entry")}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border cursor-pointer hover:border-green-400"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">
              <Building className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Health Centre
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Health Centre Data Entry
          </h3>
          <p className="text-gray-600 text-sm">
            Enter or update details for your Health Centre.
          </p>
        </div>


       {role === "GPAdmin" && <div
          onClick={() => navigate("/gp-profile")}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border cursor-pointer hover:border-green-400"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl">
              <User className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
               Profile
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Edit Your GP Profile
          </h3>
          <p className="text-gray-600 text-sm">
            Enter or update details your GP profile
          </p>
        </div>}
      
      </div>

      

      {/* Form Modal */}
      <FormModal
        moduleId={selectedModule}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModule(null);
        }}
      />
    </div>
  );
}
