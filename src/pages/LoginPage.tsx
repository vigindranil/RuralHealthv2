import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Lock, AlertCircle, Shield, Building, Users, Crown, CheckCircle } from 'lucide-react';
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

  // Redirect if already logged in (check token in cookies)
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
      }
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const roleConfig = {
    'GP': {
      icon: <Shield className="w-8 h-8" />,
      fullDescription: 'Gram Panchayat Health Monitoring'
    },
    'Health Centre': {
      icon: <Building className="w-8 h-8" />,
      fullDescription: 'Health Centre Dashboard'
    },
    'ICDS Centre': {
      icon: <Users className="w-8 h-8" />,
      fullDescription: 'ICDS Centre Management'
    },
    'District Admin': {
      icon: <Crown className="w-8 h-8" />,
      fullDescription: 'District Administration Overview'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8">
            <div className="flex items-center space-x-2 mb-8">
              <Heart className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-800">Rural Health Monitor</h1>
            </div>

            <h2 className="text-xl font-semibold mb-4">Transforming Healthcare Access</h2>
            <p className="text-gray-600 mb-6">Select your user type to access the appropriate dashboard</p>

            <div className="space-y-4">
              {Object.entries(roleConfig).map(([role, config]) => (
                <button
                  key={role}
                  onClick={() => setFormData({ ...formData, role: role as any })}
                  className={`w-full p-4 rounded-lg border-2 ${formData.role === role ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    } flex items-center space-x-4 transition-all`}
                >
                  {config.icon}
                  <div className="text-left">
                    <h3 className="font-medium">{role}</h3>
                    <p className="text-sm text-gray-500">{config.fullDescription}</p>
                  </div>
                  {formData.role === role && <CheckCircle className="ml-auto w-5 h-5 text-blue-500" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => navigate('/')} className="text-white hover:text-blue-200">
                Back to Home
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6">Secure Access Portal</h2>
            <p className="mb-8">Sign in to access your health monitoring dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:border-blue-300"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:border-blue-300"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 bg-red-500/20 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-lg font-medium mb-2">Demo Credentials</h3>
              <ul className="text-sm space-y-1">
                <li>GP: gp_admin / password</li>
                <li>ICDS: icds_admin / password</li>
                <li>Health: health_admin / password</li>
                <li>District: district_admin / password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
