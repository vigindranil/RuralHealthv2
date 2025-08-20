import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Lock, AlertCircle, Shield, Building, Users, Crown, CheckCircle, EyeOff, Eye } from 'lucide-react';
import { login } from '../api/login'; // Import the new API login function
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'; // For cookie handling

export interface DecodedPayload {
  UserID: number;
  UserTypeID: number;
  UserTypeName: string;
  Username: string;
  BoundaryLevelID: number;
  UserFullName: string;
  BoundaryID: number;
  isLoggedIn: number;
  tokenUUID: string;
  iat?: number;
  exp?: number;
}

export function decodeJwtToken(token: string): DecodedPayload | null {
  try {
    return jwtDecode<DecodedPayload>(token);
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'GP' as 'GP' | 'Health Centre' | 'ICDS Centre' | 'District Admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 new state


  // Redirect if already logged in (check token in cookies)
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const roleConfig = {
    'GP': {
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      borderColor: 'border-blue-600',
      description: 'Gram Panchayat',
      fullDescription: 'Gram Panchayat Health Monitoring',
      features: ['Data Entry Access', 'Village Health Records', 'Community Monitoring']
    },
    'Health Centre': {
      icon: <Building className="w-6 h-6" />,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      borderColor: 'border-green-600',
      description: 'Health Centre',
      fullDescription: 'Health Centre Dashboard',
      features: ['Health Data Analysis', 'Patient Records View', 'Medical Reports']
    },
    'ICDS Centre': {
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      borderColor: 'border-purple-600',
      description: 'ICDS Centre',
      fullDescription: 'ICDS Centre Management',
      features: ['Child Health Monitoring', 'Nutrition Programs', 'Development Tracking']
    },
    'District Admin': {
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      borderColor: 'border-orange-600',
      description: 'District Admin',
      fullDescription: 'District Administration Overview',
      features: ['District Analytics', 'Policy Implementation', 'Resource Management']
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = await login({
      username: formData.username,
      password: formData.password,
    });

    if (token) {
      const decoded = decodeJwtToken(token);
      console.log('Decoded token:', decoded);
      if (decoded) {
        // Store UserTypeID in cookies as required
        Cookies.set('userTypeID', decoded.UserTypeID.toString());
        Cookies.set('boundaryID', decoded.BoundaryID.toString());
        Cookies.set('boundaryLevelID', decoded.BoundaryLevelID.toString());
      }
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      {/* Left Side - User Types */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-green-600 p-8 flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        {/* Header */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">GP Profile Monitor</h1>
              <p className="text-blue-100">Transforming Healthcare Access</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Choose Your Role</h2>
          <p className="text-blue-100">Select your user type to access the appropriate dashboard</p>
        </div>

        {/* User Types */}
        <div className="relative z-10 space-y-3">
          {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => {
            const config = roleConfig[role];
            const isSelected = formData.role === role;

            // Get the background color for checkmark based on role
            const getCheckmarkColor = () => {
              switch (role) {
                case 'GP':
                  return 'bg-blue-600';
                case 'Health Centre':
                  return 'bg-green-600';
                case 'ICDS Centre':
                  return 'bg-purple-600';
                case 'District Admin':
                  return 'bg-orange-600';
                default:
                  return 'bg-blue-600';
              }
            };
            const getCardColors = () => {
              if (!isSelected) {
                return 'bg-white/10 border border-white/20 hover:bg-white/15 backdrop-blur-sm';
              }

              switch (role) {
                case 'GP':
                  return 'bg-blue-600/40 border border-blue-400/40 backdrop-blur-md';
                case 'Health Centre':
                  return 'bg-green-600/40 border border-green-400/40 backdrop-blur-md';
                case 'ICDS Centre':
                  return 'bg-purple-600/40 border border-purple-400/40 backdrop-blur-md';
                case 'District Admin':
                  return 'bg-orange-600/40 border border-orange-400/40 backdrop-blur-md';
                default:
                  return 'bg-white/40 border border-white/40 backdrop-blur-md';
              }
            };

            return (
              <div
                key={role}
                onClick={() => setFormData({ ...formData, role })}
                className={`cursor-pointer p-6 rounded-xl transition-all duration-300 ${getCardColors()} ${isSelected ? 'transform scale-[1.01]' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${isSelected ? 'bg-white/30' : 'bg-white/20'}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{config.description}</h3>
                    <p className="text-blue-100 text-sm">{config.fullDescription}</p>
                  </div>
                  {isSelected && (
                    <div className={`${getCheckmarkColor()} border-2 border-white p-2 rounded-full`}>
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GP Profile Monitor</h1>
                <p className="text-gray-600 text-sm">Secure Access Portal</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to access your health monitoring dashboard</p>
            </div>

            {/* Mobile Role Selection */}
            <div className="lg:hidden mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => {
                  const config = roleConfig[role];
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${formData.role === role
                        ? `${config.color} text-white border-transparent`
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {config.icon}
                        <span className="text-xs font-medium text-center">{config.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'} // 👈 toggle type
                    name="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // 👈 toggle state
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${roleConfig[formData.role].color} ${roleConfig[formData.role].hoverColor} text-white py-3 px-4 rounded-lg font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Sign In as {roleConfig[formData.role].description}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
