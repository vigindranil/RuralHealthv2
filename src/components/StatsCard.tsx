import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trending: 'up' | 'down';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | string; // Allow any color string
  onClick?: () => void;
}

// Adjusted to handle dynamic colors from API
const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

// Helper to get color class or fallback
const getColorClasses = (colorName: string) => {
  return colorClasses[colorName as keyof typeof colorClasses] || colorClasses.blue;
}


export default function StatsCard({ title, value, change, trending, icon, color, onClick }: StatsCardProps) {
  const isLongTitle = title.length > 45;

  return (
    <div
      className={`relative group bg-gradient-to-br from-white via-blue-50 to-green-50 rounded-2xl shadow-lg p-4 border-2 border-transparent mt-5 hover:border-blue-300 transition-all duration-200 flex flex-col h-52 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Floating Icon */}
      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-10 shadow-lg rounded-full p-3 border-4 border-white ${getColorClasses(color)} group-hover:scale-110 transition-transform`}
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}>
        {icon}
      </div>

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center text-center flex-grow pt-5">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-1 drop-shadow-sm">{value}</h3>

        {/* Title with dynamic font size and reserved space */}
        <div className="min-h-[56px] flex items-center justify-center w-full mb-1">
          <p className={`font-medium text-gray-600 ${isLongTitle ? 'text-sm' : 'text-base'
            }`}>
            {title}
          </p>
        </div>

        {/* Change Indicator */}
        <div className={`flex items-center space-x-1 text-base font-semibold ${trending === 'up' && change !== "0" ? 'text-green-600' : 'text-gray-500'
          }`}>
          {trending === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span>{change}</span>
        </div>
      </div>

      {/* More Details Link */}
      {onClick && (
        <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline focus:outline-none"
            onClick={e => { e.stopPropagation(); onClick && onClick(); }}
          >
            More Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}