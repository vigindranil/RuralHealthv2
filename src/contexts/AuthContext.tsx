import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  role: 'GP' | 'Health Centre' | 'ICDS Centre' | 'District Admin';
  district: string;
  block: string;
  gpName?: string;
  centreName?: string;
  centreId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
  role: 'GP' | 'Health Centre' | 'ICDS Centre' | 'District Admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple authentication - accepts admin/password for any role
    if (credentials.username === 'admin' && credentials.password === 'password') {
      let mockUser: User;
      if (credentials.role === 'GP') {
        mockUser = {
          id: '1',
          name: 'GP Administrator',
          role: 'GP',
          district: 'Jalpaiguri',
          block: 'Jalpaiguri Sadar',
          gpName: 'Belakoba GP',
        };
      } else if (credentials.role === 'ICDS Centre') {
        mockUser = {
          id: '2',
          name: 'ICDS Centre Admin',
          role: 'ICDS Centre',
          district: 'Jalpaiguri',
          block: 'Jalpaiguri Sadar',
          centreName: 'ICDS-1',
          centreId: 'ICDS001',
        };
      } else if (credentials.role === 'Health Centre') {
        mockUser = {
          id: '3',
          name: 'Health Centre Admin',
          role: 'Health Centre',
          district: 'Jalpaiguri',
          block: 'Jalpaiguri Sadar',
          centreName: 'Jalpaiguri PHC',
          centreId: 'HC001',
        };
      } else {
        mockUser = {
          id: '4',
          name: 'District Administrator',
          role: 'District Admin',
          district: 'Jalpaiguri',
          block: '',
        };
      }
      setUser(mockUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};