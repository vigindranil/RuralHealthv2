// src/utils/dataUtils.ts

export interface DataEntry {
  id: string;
  moduleId: string;
  data: Record<string, any>;
  createdAt: Date;
  createdBy: string; // userId or role or name
}

// Hardcoded demo/mock data entries
let entries: DataEntry[] = [
  {
    id: '1',
    moduleId: 'underage-marriage',
    data: {
      name: 'Priya Sharma',
      husbandName: 'Raj Kumar',
      villageName: 'Belakoba',
      block: 'Jalpaiguri Sadar',
      gramPanchayat: 'Belakoba',
      phoneNumber: '9876543210'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdBy: 'gp-user'
  },
  {
    id: '2',
    moduleId: 'underage-marriage',
    data: {
      name: 'Sunita Devi',
      husbandName: 'Mohan Singh',
      villageName: 'Sannyasikata',
      block: 'Jalpaiguri Sadar',
      gramPanchayat: 'Sannyasikata',
      phoneNumber: '9876543211'
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdBy: 'gp-user'
  },
  // Sample entries for other modules and blocks:
  {
    id: '3',
    moduleId: 'underage-marriage',
    data: {
      name: 'Kavita Singh',
      husbandName: 'Ravi Kumar',
      villageName: 'Maynaguri',
      block: 'Maynaguri',
      gramPanchayat: 'Maynaguri',
      phoneNumber: '9876543212'
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdBy: 'gp-user'
  },
  {
    id: '4',
    moduleId: 'low-birth-weight',
    data: {
      motherName: 'Anita Devi',
      childName: 'Baby Kumar',
      villageName: 'Baropatia Nutanabos',
      block: 'Jalpaiguri Sadar',
      gramPanchayat: 'Baropatia Nutanabos',
      phoneNumber: '9876543213'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdBy: 'gp-user'
  },
  {
    id: '5',
    moduleId: 'low-birth-weight',
    data: {
      motherName: 'Rekha Singh',
      childName: 'Baby Singh',
      villageName: 'Maynaguri',
      block: 'Maynaguri',
      gramPanchayat: 'Maynaguri',
      phoneNumber: '9876543214'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdBy: 'gp-user'
  },
  // Malnourished children
  {
    id: '6',
    moduleId: 'malnourished-children',
    data: {
      motherName: 'Sunita Kumari',
      childName: 'Rahul Kumar',
      age: '3',
      weight: '8.5',
      villageName: 'Kharija Berubari',
      block: 'Jalpaiguri Sadar',
      gramPanchayat: 'Kharija Berubari',
      phoneNumber: '9876543222'
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdBy: 'gp-user'
  },
  // ... add more demo records as needed
];

// Return array of entries
export { entries };

// Add an entry (mutates in-memory array for the demo)
export const addEntry = (moduleId: string, data: Record<string, any>, userId: string) => {
  const newEntry: DataEntry = {
    id: Date.now().toString(),
    moduleId,
    data,
    createdAt: new Date(),
    createdBy: userId,
  };
  entries = [...entries, newEntry];
};

// Get all entries for a specific module
export const getEntriesByModule = (moduleId: string): DataEntry[] =>
  entries.filter(entry => entry.moduleId === moduleId);

// Get total entry count
export const getTotalEntries = (): number => entries.length;

// Get count per module as a stats object
export const getModuleStats = (): Record<string, number> => {
  const stats: Record<string, number> = {};
  entries.forEach(entry => {
    stats[entry.moduleId] = (stats[entry.moduleId] || 0) + 1;
  });
  return stats;
};
