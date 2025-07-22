import React, { useState } from 'react';
import { FileText, Plus, Save, X, Building } from 'lucide-react';
import { getUser } from '../utils/authUtils'; // Import hardcoded user utils (replaces AuthContext)
import FormModal from '../components/FormModal';
import { useNavigate } from 'react-router-dom';

export default function DataEntry() {
  // Use hardcoded user from utils (no context) - fallback to GP for demo if null
  const user = getUser() || {
    role: 'GP',
  };
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Add this if not present

  const modules = [
    {
      id: 'childbirths',
      title: 'Childbirths (Non-Institutional)',
      description: 'Record non-institutional births in the last month',
      icon: '👶',
      count: 8
    },
    {
      id: 'underage-marriage',
      title: 'Under Age Marriages',
      description: 'Report marriages involving minors',
      icon: '💍',
      count: 3
    },
    {
      id: 'low-birth-weight',
      title: 'Low Birth Weight Children',
      description: 'Track children with low birth weight',
      icon: '⚖️',
      count: 8
    },
    {
      id: 'incomplete-immunization',
      title: 'Incomplete Immunization',
      description: 'Children who have not completed immunization',
      icon: '💉',
      count: 0
    },
    {
      id: 'young-pregnant-mothers',
      title: 'Under 20 Pregnant Mothers',
      description: 'Pregnant mothers under 20 years of age',
      icon: '🤱',
      count: 0
    },
    {
      id: 'teenage-pregnancy',
      title: 'Teenage Pregnancy Registered',
      description: 'Registered teenage pregnancies',
      icon: '📋',
      count: 0
    },
    {
      id: 'high-risk-pregnancy',
      title: 'High-Risk Pregnancy',
      description: 'Pregnant women with high-risk conditions',
      icon: '⚠️',
      count: 3
    },
    {
      id: 'malnourished-children',
      title: 'Malnourished Children',
      description: 'Children identified as malnourished',
      icon: '🍽️',
      count: 5
    },
    {
      id: 'underweight-children',
      title: 'Severely Underweight Children',
      description: 'Children who are severely underweight',
      icon: '📏',
      count: 2
    },
    {
      id: 'anemic-girls',
      title: 'Anemic Adolescent Girls',
      description: 'Adolescent girls who are anemic',
      icon: '🩸',
      count: 2
    },
    {
      id: 'infectious-diseases',
      title: 'Infectious Diseases',
      description: 'Cases of infectious diseases in the last month',
      icon: '🦠',
      count: 3
    },
    {
      id: 'tb-leprosy',
      title: 'TB and Leprosy Patients',
      description: 'Patients with TB or leprosy',
      icon: '🏥',
      count: 2
    },
    {
      id: 'toilet-facilities',
      title: 'Toilet Facilities Update',
      description: 'Monthly update on household toilet facilities',
      icon: '🚽',
      count: 0
    }
  ];

  const handleModuleClick = (moduleId: string) => {
    if (user?.role === 'GP') {
      setSelectedModule(moduleId);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Entry</h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'GP'
            ? 'Select a module to enter new data'
            : 'Data entry is restricted to GP users only'
          }
        </p>
      </div>

      {/* Access Notice for Non-GP Users */}
      {user?.role !== 'GP' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">
              Data entry is only available for GP (Gram Panchayat) users.
              You can view existing data and reports from the Dashboard and Reports sections.
            </p>
          </div>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => handleModuleClick(module.id)}
            className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border ${user?.role === 'GP'
                ? 'cursor-pointer hover:border-blue-300'
                : 'cursor-not-allowed opacity-60'
              }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{module.icon}</div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {module.count} entries
                </span>
                {user?.role === 'GP' && <Plus className="w-5 h-5 text-blue-600" />}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
            <p className="text-gray-600 text-sm">{module.description}</p>
          </div>
        ))}
        <div
          onClick={() => navigate('/icds-data-entry')}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ICDS Centre Data Entry</h3>
          <p className="text-gray-600 text-sm">
            Enter or update details for your Anganwadi/ICDS Centre.
          </p>
        </div>

        <div
          onClick={() => navigate('/health-centre-data-entry')}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Centre Data Entry</h3>
          <p className="text-gray-600 text-sm">
            Enter or update details for your Health Centre.
          </p>
        </div>
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
