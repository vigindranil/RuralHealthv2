import React, { useEffect, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, LayoutDashboard, FileText, BarChart3, LogOut, User } from 'lucide-react';
import Cookies from 'js-cookie';
import { decodeJwtToken } from '../utils/decodetoken';

// --- TYPE DEFINITIONS for strong typing ---

// 1. Define the structure of the user profile stored in state
interface UserProfile {
  name: string;
  userTypeID: number;
  roleName: string;
}

// 2. Define the expected structure of the decoded JWT payload
interface DecodedToken {
  UserFullName: string;
  UserTypeID: number;
  // Add other JWT standard claims if needed, e.g., exp: number;
}

// 3. Define the structure for a navigation item
interface NavItem {
  path: string;
  label: string;
  icon: ReactNode; // A ReactNode can be any valid JSX
}

// Define UserTypeIDs as a const for better readability and maintenance
const USER_TYPE_IDS = {
  DISTRICT_ADMIN: 200,
  GP_ADMIN: 600,
};


export default function Navigation(): JSX.Element | null {
  const navigate = useNavigate();
  const location = useLocation();

  // Typed state: UserProfile or null. No more 'any'.
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      // Assume decodeJwtToken returns DecodedToken or null
      const decoded = decodeJwtToken(token) as DecodedToken | null;

      if (decoded && decoded.UserTypeID) {
        const userTypeID = decoded.UserTypeID;
        let roleName = 'User'; // Default

        if (userTypeID === USER_TYPE_IDS.DISTRICT_ADMIN) {
          roleName = 'District Admin';
        } else if (userTypeID === USER_TYPE_IDS.GP_ADMIN) {
          roleName = 'GP Admin';
        }

        setUser({
          name: decoded.UserFullName,
          userTypeID: userTypeID,
          roleName: roleName,
        });
      } else {
        handleLogout(true); // Invalid token, force redirect to login
      }
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]); // navigate is stable and can be a dependency

  const handleLogout = (redirectToLogin: boolean = false): void => {
    Cookies.remove('authToken');
    Cookies.remove('userTypeID');
    navigate(redirectToLogin ? '/login' : '/');
  };

  if (!user) {
    // Return null (or a loading skeleton) while user is being authenticated
    return null;
  }

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/data-entry', label: 'Data Entry', icon: <FileText className="w-5 h-5" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  // Condition is now type-safe, checking against the number in the user profile
  const canSeeDataEntry = user.userTypeID === USER_TYPE_IDS.GP_ADMIN;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GP Profile Monitor</span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              (item.path === '/data-entry' && !canSeeDataEntry) ? null : (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${location.pathname.startsWith(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-sm text-right">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.roleName}</div>
              </div>
            </div>

            <button
              onClick={() => handleLogout()}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3 border-t border-gray-200">
          <div className="flex justify-around space-x-1">
            {navItems.map((item) => (
              (item.path === '/data-entry' && !canSeeDataEntry) ? null : (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex-1 flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${location.pathname.startsWith(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}