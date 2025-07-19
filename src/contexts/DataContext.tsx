import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataEntry {
  id: string;
  moduleId: string;
  data: Record<string, any>;
  createdAt: Date;
  createdBy: string;
}

interface DataContextType {
  entries: DataEntry[];
  addEntry: (moduleId: string, data: Record<string, any>, userId: string) => void;
  getEntriesByModule: (moduleId: string) => DataEntry[];
  getTotalEntries: () => number;
  getModuleStats: () => Record<string, number>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with mock data
  const [entries, setEntries] = useState<DataEntry[]>([
    // Jalpaiguri Sadar Block
    {
      id: '1',
      moduleId: 'underage-marriage',
      data: { name: 'Priya Sharma', husbandName: 'Raj Kumar', villageName: 'Belakoba', block: 'Jalpaiguri Sadar', gramPanchayat: 'Belakoba', phoneNumber: '9876543210' },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
    {
      id: '2',
      moduleId: 'underage-marriage',
      data: { name: 'Sunita Devi', husbandName: 'Mohan Singh', villageName: 'Sannyasikata', block: 'Jalpaiguri Sadar', gramPanchayat: 'Sannyasikata', phoneNumber: '9876543211' },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
    // Maynaguri Block
    {
      id: '3',
      moduleId: 'underage-marriage',
      data: { name: 'Kavita Singh', husbandName: 'Ravi Kumar', villageName: 'Maynaguri', block: 'Maynaguri', gramPanchayat: 'Maynaguri', phoneNumber: '9876543212' },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
    {
      id: '4',
      moduleId: 'low-birth-weight',
      data: { motherName: 'Anita Devi', childName: 'Baby Kumar', villageName: 'Baropatia Nutanabos', block: 'Jalpaiguri Sadar', gramPanchayat: 'Baropatia Nutanabos', phoneNumber: '9876543213' },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
    {
      id: '5',
      moduleId: 'low-birth-weight',
      data: { motherName: 'Rekha Singh', childName: 'Baby Singh', villageName: 'Maynaguri', block: 'Maynaguri', gramPanchayat: 'Maynaguri', phoneNumber: '9876543214' },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
    // More entries for each block/GP...
    {
      id: '6',
      moduleId: 'malnourished-children',
      data: { motherName: 'Sunita Kumari', childName: 'Rahul Kumar', age: '3', weight: '8.5', villageName: 'Kharija Berubari', block: 'Jalpaiguri Sadar', gramPanchayat: 'Kharija Berubari', phoneNumber: '9876543222' },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
    {
      id: '7',
      moduleId: 'malnourished-children',
      data: { motherName: 'Rita Singh', childName: 'Priya Singh', age: '4', weight: '9.2', villageName: 'Barnish', block: 'Maynaguri', gramPanchayat: 'Barnish', phoneNumber: '9876543223' },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
    {
      id: '8',
      moduleId: 'high-risk-pregnancy',
      data: { motherName: 'Deepa Devi', husbandName: 'Suresh Kumar', villageName: 'Patkata', block: 'Jalpaiguri Sadar', gramPanchayat: 'Patkata', phoneNumber: '9876543227' },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
    {
      id: '9',
      moduleId: 'high-risk-pregnancy',
      data: { motherName: 'Neeta Singh', husbandName: 'Ramesh Singh', villageName: 'Saptibari', block: 'Maynaguri', gramPanchayat: 'Saptibari', phoneNumber: '9876543228' },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: 'gp-user'
    },
  ]);

  const addEntry = (moduleId: string, data: Record<string, any>, userId: string) => {
    const newEntry: DataEntry = {
      id: Date.now().toString(),
      moduleId,
      data,
      createdAt: new Date(),
      createdBy: userId
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const getEntriesByModule = (moduleId: string) => {
    return entries.filter(entry => entry.moduleId === moduleId);
  };

  const getTotalEntries = () => {
    return entries.length;
  };

  const getModuleStats = () => {
    const stats: Record<string, number> = {};
    entries.forEach(entry => {
      stats[entry.moduleId] = (stats[entry.moduleId] || 0) + 1;
    });
    return stats;
  };

  const value: DataContextType = {
    entries,
    addEntry,
    getEntriesByModule,
    getTotalEntries,
    getModuleStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};