import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trending: 'up' | 'down';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple';
  onClick?: () => void;
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600'
};

export default function StatsCard({ title, value, change, trending, icon, color, onClick }: StatsCardProps) {
  return (
    <div
      className={`relative group bg-gradient-to-br from-white via-blue-50 to-green-50 rounded-2xl shadow-lg p-6 border-2 border-transparent mt-5 hover:border-blue-300 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Floating Icon */}
      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-10 shadow-lg rounded-full p-3 border-4 border-white ${colorClasses[color]} group-hover:scale-110 transition-transform`}
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}>
        {icon}
      </div>
      <div className="flex flex-col items-center justify-center mt-8">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-1 drop-shadow-sm">{value}</h3>
        <p className="text-gray-600 text-base font-medium mb-2 text-center">{title}</p>
        <div className={`flex items-center space-x-1 text-base font-semibold ${
          trending === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trending === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span>{change}</span>
        </div>
      </div>
      {/* More Details Link */}
      <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline focus:outline-none"
          onClick={e => { e.stopPropagation(); onClick && onClick(); }}
        >
          More Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}