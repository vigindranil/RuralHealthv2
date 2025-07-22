import { Cookies } from 'react-cookie'; 

export type UserRole = 'GP' | 'Health Centre' | 'ICDS Centre' | 'District Admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  district: string;
  block: string;
  gpName?: string;
  centreName?: string;
  centreId?: string;
  // ... other profile fields
}

interface LoginCredentials {
  username: string;
  password: string;
  role: UserRole;
}

// Initialize a Cookies instance (reused across functions)
const cookies = new Cookies();

const hardcodedCredentials: Record<UserRole, { username: string; password: string; user: User }> = {
  'GP': {
    username: 'gp_admin',
    password: 'password',
    user: {
      id: '1',
      name: 'GP Administrator',
      role: 'GP',
      district: 'Jalpaiguri',
      block: 'Jalpaiguri Sadar',
      gpName: 'Belakoba GP',
    },
  },
  'ICDS Centre': {
    username: 'icds_admin',
    password: 'password',
    user: {
      id: '2',
      name: 'ICDS Centre Admin',
      role: 'ICDS Centre',
      district: 'Jalpaiguri',
      block: 'Jalpaiguri Sadar',
      centreName: 'ICDS-1',
      centreId: 'ICDS001',
    },
  },
  'Health Centre': {
    username: 'health_admin',
    password: 'password',
    user: {
      id: '3',
      name: 'Health Centre Admin',
      role: 'Health Centre',
      district: 'Jalpaiguri',
      block: 'Jalpaiguri Sadar',
      centreName: 'Jalpaiguri PHC',
      centreId: 'HC001',
    },
  },
  'District Admin': {
    username: 'district_admin',
    password: 'password',
    user: {
      id: '4',
      name: 'District Administrator',
      role: 'District Admin',
      district: 'Jalpaiguri',
      block: '',
    },
  },
};

export const login = async (credentials: LoginCredentials): Promise<boolean> => {
  // Simulate an API delay
  await new Promise((res) => setTimeout(res, 200));

  const { username, password, role } = credentials;
  const cred = hardcodedCredentials[role];

  if (cred && username === cred.username && password === cred.password) {
    // Persist the user in a cookie using react-cookie
    cookies.set('currentUser', JSON.stringify(cred.user), { path: '/', maxAge: 86400 }); // Expires in 1 day
    return true;
  }
  return false;
};

export const logout = () => {
  cookies.remove('currentUser', { path: '/' });
};

export const getUser = (): User | null => {
  const userStr = cookies.get('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: User | null) => {
  if (user) {
    cookies.set('currentUser', JSON.stringify(user), { path: '/', maxAge: 86400 }); // Expires in 1 day
  } else {
    cookies.remove('currentUser', { path: '/' });
  }
};

export const getAllUsers = (): User[] => Object.values(hardcodedCredentials).map(c => c.user);
