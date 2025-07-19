import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, FileText, TrendingUp, AlertTriangle, Users, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function Reports() {
  const { user } = useAuth();
  const { getModuleStats, entries } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedModule, setSelectedModule] = useState('all');

  const moduleStats = getModuleStats();

  // Only show data that can be entered through the portal
  const reportTypes = [
    {
      id: 'maternal-health',
      title: 'Maternal Health Report',
      description: 'High-risk pregnancies and maternal health indicators',
      icon: '🤱',
      data: { 
        highRisk: moduleStats['high-risk-pregnancy'] || 0, 
        teenage: moduleStats['teenage-pregnancy'] || 0, 
        young: moduleStats['young-pregnant-mothers'] || 0 
      }
    },
    {
      id: 'child-health',
      title: 'Child Health Report',
      description: 'Child health and nutrition status report',
      icon: '👶',
      data: { 
        malnourished: moduleStats['malnourished-children'] || 0, 
        underweight: moduleStats['underweight-children'] || 0, 
        lowBirth: moduleStats['low-birth-weight'] || 0 
      }
    },
    {
      id: 'infectious-diseases',
      title: 'Infectious Disease Report',
      description: 'Disease surveillance and outbreak monitoring',
      icon: '🦠',
      data: { 
        infectious: moduleStats['infectious-diseases'] || 0, 
        tb: moduleStats['tb-leprosy'] || 0, 
        total: (moduleStats['infectious-diseases'] || 0) + (moduleStats['tb-leprosy'] || 0) 
      }
    },
    {
      id: 'social-issues',
      title: 'Social Issues Report',
      description: 'Under-age marriages and social health indicators',
      icon: '👥',
      data: { 
        marriages: moduleStats['underage-marriage'] || 0, 
        anemic: moduleStats['anemic-girls'] || 0, 
        total: (moduleStats['underage-marriage'] || 0) + (moduleStats['anemic-girls'] || 0) 
      }
    }
  ];

  // Generate monthly data based on actual entries
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const monthlyData = [
    { month: 'January', underageMarriages: 0, malnourished: 0, highRisk: 0, diseases: 0 },
    { month: 'February', underageMarriages: 0, malnourished: 0, highRisk: 0, diseases: 0 },
    { month: 'March', underageMarriages: 0, malnourished: 0, highRisk: 0, diseases: 0 },
    { month: 'April', underageMarriages: 0, malnourished: 0, highRisk: 0, diseases: 0 },
    { month: 'May', underageMarriages: 0, malnourished: 0, highRisk: 0, diseases: 0 },
    { 
      month: currentMonth, 
      underageMarriages: moduleStats['underage-marriage'] || 0, 
      malnourished: moduleStats['malnourished-children'] || 0, 
      highRisk: moduleStats['high-risk-pregnancy'] || 0,
      diseases: (moduleStats['infectious-diseases'] || 0) + (moduleStats['tb-leprosy'] || 0)
    }
  ];

  const handleDownload = (reportType: string) => {
    // Simulate report download
    const reportData = reportTypes.find(r => r.id === reportType);
    if (reportData) {
      alert(`Downloading ${reportData.title}...\n\nReport includes:\n${Object.entries(reportData.data).map(([key, value]) => `${key}: ${value}`).join('\n')}`);
    }
  };

  const totalCases = Object.values(moduleStats).reduce((sum, count) => sum + count, 0);
  const criticalCases = (moduleStats['high-risk-pregnancy'] || 0) + (moduleStats['infectious-diseases'] || 0) + (moduleStats['tb-leprosy'] || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive health monitoring reports based on portal data entries
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{totalCases}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Cases</p>
              <p className="text-2xl font-bold text-gray-900">{criticalCases}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Children at Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {(moduleStats['malnourished-children'] || 0) + (moduleStats['underweight-children'] || 0) + (moduleStats['low-birth-weight'] || 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Social Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {(moduleStats['underage-marriage'] || 0) + (moduleStats['anemic-girls'] || 0)}
              </p>
            </div>
            <Heart className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="current-year">Current Year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Module Filter
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Modules</option>
              <option value="maternal">Maternal Health</option>
              <option value="child">Child Health</option>
              <option value="diseases">Infectious Diseases</option>
              <option value="social">Social Issues</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Coverage Area
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="my-area">{user?.role === 'GP' ? user?.gpName : user?.centreName}</option>
              <option value="block">{user?.block} Block</option>
              <option value="district">{user?.district} District</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {reportTypes.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{report.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-gray-600 text-sm">{report.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(report.id)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {Object.entries(report.data).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-xl font-bold text-blue-600">{value}</div>
                  <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          <div className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Data from portal entries</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Month</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Under Age Marriages</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Malnourished</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">High Risk</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Diseases</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.month}</td>
                  <td className="py-3 px-4 text-center text-red-600 font-semibold">{row.underageMarriages}</td>
                  <td className="py-3 px-4 text-center text-orange-600 font-semibold">{row.malnourished}</td>
                  <td className="py-3 px-4 text-center text-purple-600 font-semibold">{row.highRisk}</td>
                  <td className="py-3 px-4 text-center text-blue-600 font-semibold">{row.diseases}</td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Entry Summary */}
      {entries.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Data Entries Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{entries.length}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {entries.filter(e => {
                  const today = new Date();
                  const entryDate = new Date(e.createdAt);
                  return entryDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <div className="text-sm text-gray-600">Today's Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(entries.map(e => e.moduleId)).size}
              </div>
              <div className="text-sm text-gray-600">Active Modules</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}