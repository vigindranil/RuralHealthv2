import React from 'react';
import { Heart, Users, Baby, Shield, TrendingUp, AlertTriangle, FileText, Activity, Calendar, MapPin } from 'lucide-react';
import { entries, getModuleStats, getTotalEntries } from '../utils/dataUtils'; // Kept for demo data (remove if not needed)
import StatsCard from '../components/StatsCard';
import ChartCard from '../components/ChartCard';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Standardized to js-cookie
import { decodeJwtToken } from '../utils/decodetoken';
import Navigation from '../components/Navigation';

// Add static block/GP data at the top (after imports):
const BLOCKS = ['All', 'Jalpaiguri Sadar', 'Maynaguri'];
const GPS: Record<string, string[]> = {
  'All': ['All'],
  'Jalpaiguri Sadar': ['All', 'Belakoba', 'Sannyasikata', 'Kharija Berubari', 'Kharia', 'Binnaguri', 'Baropatia Nutanabos', 'Patkata', 'Saptibari', 'Barnish', 'Kumargram'],
  'Maynaguri': ['All', 'Maynaguri', 'Barnish', 'Saptibari'],
};

export default function Dashboard() {
  // Initialize user as null (no getUser or fallback)
  const [user, setUser] = React.useState<any>(null); // Type as any for flexibility; adjust as needed
  const navigate = useNavigate();

  // Default to 'All' since user might be null initially
  const [selectedBlock, setSelectedBlock] = React.useState('All');
  const [selectedGP, setSelectedGP] = React.useState(GPS[selectedBlock][0]);

  // Update GP list and reset selected GP when block changes
  React.useEffect(() => {
    setSelectedGP(GPS[selectedBlock][0]);
  }, [selectedBlock]);

  // Decode token and update user state on mount
  React.useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      // Redirect to login if no token
      navigate('/');
      return;
    }

    const decoded = decodeJwtToken(token);
    console.log('Decoded token:', decoded);
    if (decoded) {
      // Map role based on UserTypeID or UserTypeName
      let mappedRole = 'GP'; // Default fallback
      if (decoded.UserTypeID === 150 || decoded.UserTypeName === 'DistrictAdmin') {
        mappedRole = 'District Admin';
      } else if (decoded.UserTypeName === 'ICDS') {
        mappedRole = 'ICDS Centre';
      } else if (decoded.UserTypeName === 'Health') {
        mappedRole = 'Health Centre';
      }

      // Map additional fields based on decoded token (demo mappings; adjust as needed)
      let block = 'Jalpaiguri Sadar';
      let gpName = 'Belakoba GP';
      let centreName = '';
      let centreId = decoded.BoundaryID.toString(); // Use BoundaryID as centreId for ICDS/Health

      if (mappedRole === 'GP') {
        block = 'Jalpaiguri Sadar'; // Example: map based on BoundaryLevelID/BoundaryID
        gpName = `GP ${decoded.BoundaryID}`; // Example mapping
      } else if (mappedRole === 'ICDS Centre') {
        centreName = `ICDS Centre ${decoded.BoundaryID}`;
      } else if (mappedRole === 'Health Centre') {
        centreName = `Health Centre ${decoded.BoundaryID}`;
      } else if (mappedRole === 'District Admin') {
        block = 'All';
        gpName = 'All';
      }

      setUser({
        id: decoded.UserID.toString(),
        name: decoded.UserFullName,
        role: mappedRole,
        district: decoded.BoundaryID ? `District ${decoded.BoundaryID}` : 'Jalpaiguri',
        block,
        gpName,
        centreName,
        centreId, // Added for filtering
      });

      // Update selectedBlock/GP based on mapped values
      setSelectedBlock(block);
      setSelectedGP(gpName);
    } else {
      // Invalid token: clear cookies and redirect
      Cookies.remove('authToken');
      Cookies.remove('userTypeID');
      navigate('/');
    }
  }, [navigate]);

  // Loading state while decoding user
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Role-based disables
  const isGP = user?.role === 'GP';
  const isICDS = user?.role === 'ICDS Centre';
  const isHealth = user?.role === 'Health Centre';
  const isDistrict = user?.role === 'District Admin';

  // Filter entries by role (using hardcoded entries from dataUtils)
  let filteredEntries = entries;
  if (isGP) {
    filteredEntries = entries.filter(entry =>
      (entry.data.block === user.block || !entry.data.block) &&
      (entry.data.gramPanchayat === user.gpName || !entry.data.gramPanchayat)
    );
  } else if (isICDS) {
    filteredEntries = entries.filter(entry =>
      entry.data.icdsCentreName === user.centreName || entry.data.icdsCentreId === user.centreId
    );
  } else if (isHealth) {
    filteredEntries = entries.filter(entry =>
      entry.data.healthCentreName === user.centreName || entry.data.healthCentreId === user.centreId
    );
  } else if (isDistrict) {
    filteredEntries = entries.filter(entry => {
      const entryBlock = entry.data.block || user?.block;
      const entryGP = entry.data.gramPanchayat || user?.gpName;
      const blockMatch = selectedBlock === 'All' || entryBlock === selectedBlock;
      const gpMatch = selectedGP === 'All' || entryGP === selectedGP;
      return blockMatch && gpMatch;
    });
  }

  // Use filteredEntries for stats, charts, etc. (using functions from dataUtils)
  const moduleStats = getModuleStats();
  const totalEntries = getTotalEntries();

  // Only show data that can be entered through the portal
  const underageMarriages = moduleStats['underage-marriage'] || 0;
  const lowBirthWeight = moduleStats['low-birth-weight'] || 0;
  const malnourished = moduleStats['malnourished-children'] || 0;
  const highRiskPregnancy = moduleStats['high-risk-pregnancy'] || 0;
  const infectiousDiseases = moduleStats['infectious-diseases'] || 0;
  const tbLeprosy = moduleStats['tb-leprosy'] || 0;
  const anemicGirls = moduleStats['anemic-girls'] || 0;
  const underweightChildren = moduleStats['underweight-children'] || 0;

  // Map stat title to moduleId for navigation
  const statModuleMap: Record<string, string> = {
    'Under Age Marriages': 'underage-marriage',
    'Low Birth Weight Children': 'low-birth-weight',
    'Malnourished Children': 'malnourished-children',
    'High Risk Pregnancies': 'high-risk-pregnancy',
    'Infectious Diseases': 'infectious-diseases',
    'TB & Leprosy Patients': 'tb-leprosy',
    'Anemic Adolescent Girls': 'anemic-girls',
    'Underweight Children': 'underweight-children',
  };

  const stats = [
    {
      title: "Under Age Marriages",
      value: underageMarriages.toString(),
      change: underageMarriages > 0 ? `+${underageMarriages}` : "0",
      trending: "up" as const,
      icon: <Users className="w-6 h-6" />,
      color: "red" as const
    },
    {
      title: "Low Birth Weight Children",
      value: lowBirthWeight.toString(),
      change: lowBirthWeight > 0 ? `+${lowBirthWeight}` : "0",
      trending: "up" as const,
      icon: <Baby className="w-6 h-6" />,
      color: "purple" as const
    },
    {
      title: "Malnourished Children",
      value: malnourished.toString(),
      change: malnourished > 0 ? `+${malnourished}` : "0",
      trending: "up" as const,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "red" as const
    },
    {
      title: "High Risk Pregnancies",
      value: highRiskPregnancy.toString(),
      change: highRiskPregnancy > 0 ? `+${highRiskPregnancy}` : "0",
      trending: "up" as const,
      icon: <Heart className="w-6 h-6" />,
      color: "purple" as const
    }
  ];

  // Additional stats for second row
  const additionalStats = [
    {
      title: "Infectious Diseases",
      value: infectiousDiseases.toString(),
      change: infectiousDiseases > 0 ? `+${infectiousDiseases}` : "0",
      trending: "up" as const,
      icon: <Activity className="w-6 h-6" />,
      color: "red" as const
    },
    {
      title: "TB & Leprosy Patients",
      value: tbLeprosy.toString(),
      change: tbLeprosy > 0 ? `+${tbLeprosy}` : "0",
      trending: "up" as const,
      icon: <Shield className="w-6 h-6" />,
      color: "blue" as const
    },
    {
      title: "Anemic Adolescent Girls",
      value: anemicGirls.toString(),
      change: anemicGirls > 0 ? `+${anemicGirls}` : "0",
      trending: "up" as const,
      icon: <Users className="w-6 h-6" />,
      color: "purple" as const
    },
    {
      title: "Underweight Children",
      value: underweightChildren.toString(),
      change: underweightChildren > 0 ? `+${underweightChildren}` : "0",
      trending: "up" as const,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "red" as const
    }
  ];

  // Get recent entries from actual data
  const recentEntries = filteredEntries
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map(entry => ({
      module: getModuleName(entry.moduleId),
      count: 1,
      time: getTimeAgo(entry.createdAt),
      data: entry.data
    }));

  function getModuleName(moduleId: string): string {
    const moduleNames: Record<string, string> = {
      'childbirths': 'Childbirths',
      'underage-marriage': 'Under Age Marriages',
      'low-birth-weight': 'Low Birth Weight',
      'incomplete-immunization': 'Immunization',
      'young-pregnant-mothers': 'Young Pregnant Mothers',
      'teenage-pregnancy': 'Teenage Pregnancy',
      'high-risk-pregnancy': 'High Risk Pregnancy',
      'malnourished-children': 'Malnourished Children',
      'underweight-children': 'Underweight Children',
      'anemic-girls': 'Anemic Girls',
      'infectious-diseases': 'Infectious Diseases',
      'tb-leprosy': 'TB/Leprosy',
      'toilet-facilities': 'Toilet Facilities'
    };
    return moduleNames[moduleId] || moduleId;
  }

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6  py-8">
      
      {/* Block/GP Filter Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        {isDistrict && (
          <>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-blue-700 flex items-center gap-1"><MapPin className="w-4 h-4" />Block</label>
              <select
                value={selectedBlock}
                onChange={e => setSelectedBlock(e.target.value)}
                className="border-2 border-blue-300 rounded-lg px-4 py-2 bg-white text-blue-900 font-semibold shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all min-w-[180px]"
              >
                {BLOCKS.map(block => <option key={block} value={block}>{block}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-semibold text-blue-700 flex items-center gap-1"><Users className="w-4 h-4" />Gram Panchayat</label>
              <select
                value={selectedGP}
                onChange={e => setSelectedGP(e.target.value)}
                className="border-2 border-blue-300 rounded-lg px-4 py-2 bg-white text-blue-900 font-semibold shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all min-w-[180px]"
              >
                {GPS[selectedBlock].map(gp => <option key={gp} value={gp}>{gp}</option>)}
              </select>
            </div>
          </>
        )}
        {isICDS && (
          <div className="px-4 py-2 bg-purple-50 text-purple-800 rounded-lg font-semibold border border-purple-200">ICDS Centre: {user.centreName}</div>
        )}
        {isHealth && (
          <div className="px-4 py-2 bg-green-50 text-green-800 rounded-lg font-semibold border border-green-200">Health Centre: {user.centreName}</div>
        )}
        {isGP && (
          <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg font-semibold border border-blue-200">GP: {user.gpName}</div>
        )}
      </div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Monitoring Dashboard</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{user?.block || 'Jalpaiguri Sadar Block'} | {user?.gpName || 'Belakoba GP'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
            {totalEntries} Total Records
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
            onClick={() => navigate(`/details/${statModuleMap[stat.title]}`)}
          />
        ))}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {additionalStats.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
            onClick={() => navigate(`/details/${statModuleMap[stat.title]}`)}
          />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <ChartCard
            title="Health Issues by Category"
            type="bar"
            data={{
              labels: ['Malnutrition', 'High Risk', 'Diseases', 'Social Issues'],
              datasets: [
                {
                  label: 'Cases Reported',
                  data: [
                    malnourished + underweightChildren,
                    highRiskPregnancy,
                    infectiousDiseases + tbLeprosy,
                    underageMarriages
                  ],
                  color: '#EF4444'
                }
              ]
            }}
          />

          <ChartCard
            title="Vulnerable Groups Monitoring"
            type="line"
            data={{
              labels: ['Children', 'Adolescents', 'Pregnant Women', 'Patients'],
              datasets: [
                {
                  label: 'At Risk Population',
                  data: [
                    malnourished + lowBirthWeight + underweightChildren,
                    anemicGirls,
                    highRiskPregnancy,
                    infectiousDiseases + tbLeprosy
                  ],
                  color: '#8B5CF6'
                }
              ]
            }}
          />
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Data Entries</h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{entry.module}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.data.name || entry.data.motherName || entry.data.patientName || 'New Entry'}
                      </p>
                      <p className="text-xs text-gray-400">{entry.time}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      New
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No data entries yet</p>
                {user?.role === 'GP' && (
                  <p className="text-sm text-blue-600">Start by adding data in the Data Entry section</p>
                )}
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Cases</span>
                <span className="font-semibold text-gray-900">{totalEntries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Critical Cases</span>
                <span className="font-semibold text-red-600">{highRiskPregnancy + infectiousDiseases}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Children at Risk</span>
                <span className="font-semibold text-orange-600">{malnourished + underweightChildren + lowBirthWeight}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Social Issues</span>
                <span className="font-semibold text-purple-600">{underageMarriages}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {user?.role === 'GP' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  onClick={() => navigate('/data-entry')}
                >
                  <FileText className="w-4 h-4" />
                  <span>Add New Record</span>
                </button>
                <button
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  onClick={() => navigate('/reports')}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View Reports</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
