import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trending: 'up' | 'down';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | string; // Added yellow for completeness
  onClick?: () => void;
}

// Color mapping for the icon background
const colorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

// Helper to get color class or provide a fallback
const getColorClasses = (colorName: string): string => {
  return colorClasses[colorName] || colorClasses.blue;
}

export default function StatsCard({ title, value, change, trending, icon, color, onClick }: StatsCardProps) {
  const isLongTitle = title.length > 45;

  return (
    <div
      className={`
        relative group bg-white/60 backdrop-blur-md rounded-2xl p-4 border-2 border-transparent mt-5 
        hover:border-blue-400 transition-all duration-200 flex flex-col h-52 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.10)]
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {/* Gradient Border Accent - no changes needed here */}
      <div
        className="
          absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent 
          group-hover:border-blue-400 group-hover:shadow-lg z-10 
          bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(16,185,129,0.10)]
        "
      />

      {/* Floating Icon - no changes needed here */}
      <div
        className={`
          absolute -top-7 left-1/2 -translate-x-1/2 z-10 rounded-full p-3 border-4 border-white 
          ${getColorClasses(color)} group-hover:scale-110 group-hover:animate-float transition-transform duration-300
          shadow-[0_4px_24px_0_rgba(0,0,0,0.10)]
        `}
      >
        {icon}
      </div>

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center text-center flex-grow pt-7 relative z-10">
        <h3 className="text-4xl font-extrabold text-gray-900 mb-1 drop-shadow-sm tracking-tight">{value}</h3>

        <div className="min-h-[56px] flex items-center justify-center w-full mb-1">
          <p className={`font-semibold text-gray-700 ${isLongTitle ? 'text-sm' : 'text-base'} leading-tight`}>{title}</p>
        </div>

        {/* --- CHANGE IS HERE --- */}
        {/* Change Indicator now fades out on hover */}
        <div className="flex items-center justify-center mt-1 transition-opacity duration-200 group-hover:opacity-0">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm
            ${trending === 'up' && change !== '0' ? 'bg-green-100 text-green-700' : trending === 'down' && change !== '0' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}
          >
            {trending === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{change}</span>
          </span>
        </div>
      </div>

      {/* More Details Link - already correctly fades in */}
      {onClick && (
        <div className="absolute bottom-4 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 duration-200">
          <button
            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs px-3 py-1 rounded-full shadow focus:outline-none border border-blue-200 transition-colors"
            onClick={e => { e.stopPropagation(); onClick && onClick(); }}
          >
            More Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}