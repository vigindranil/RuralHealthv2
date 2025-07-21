import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, LayoutDashboard, FileText, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/data-entry', label: 'Data Entry', icon: <FileText className="w-5 h-5" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Rural Health Monitor</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              // Only show Data Entry for GP users
              (item.path === '/data-entry' && user?.role !== 'GP') ? null : (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
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
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-gray-500">{user?.role}</div>
              </div>
            </div>
            {user?.role === 'GP' && (
                <button
                  onClick={() => navigate('/gp-profile')}
                  className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Edit GP Profile</span>
                </button>
              )}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3 border-t border-gray-200">
          <div className="flex space-x-1">
            {navItems.map((item) => (
              // Only show Data Entry for GP users
              (item.path === '/data-entry' && user?.role !== 'GP') ? null : (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
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