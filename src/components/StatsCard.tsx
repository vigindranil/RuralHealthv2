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

  // Inject animation keyframes globally once
  if (typeof window !== 'undefined' && !document.getElementById('statscard-float-style')) {
    const style = document.createElement('style');
    style.id = 'statscard-float-style';
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
        100% { transform: translateY(0); }
      }
      .animate-float { animation: float 1.6s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
  }

  return (
    <div
      className={`relative group bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-4 border-2 border-transparent mt-5 hover:border-blue-400 transition-all duration-200 flex flex-col h-52 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
      onClick={onClick}
    >
      {/* Gradient Border Accent */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-hover:border-blue-400 group-hover:shadow-lg" style={{ zIndex: 1, background: 'linear-gradient(120deg, rgba(59,130,246,0.12) 0%, rgba(16,185,129,0.10) 100%)' }} />

      {/* Floating Icon with Animation */}
      <div className={`absolute -top-7 left-1/2 -translate-x-1/2 z-10 shadow-lg rounded-full p-3 border-4 border-white ${getColorClasses(color)} group-hover:scale-110 group-hover:animate-float transition-transform duration-300`}
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}>
        {icon}
      </div>

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center text-center flex-grow pt-7 relative z-10">
        <h3 className="text-4xl font-extrabold text-gray-900 mb-1 drop-shadow-sm tracking-tight">{value}</h3>

        {/* Title with dynamic font size and reserved space */}
        <div className="min-h-[56px] flex items-center justify-center w-full mb-1">
          <p className={`font-semibold text-gray-700 ${isLongTitle ? 'text-sm' : 'text-base'} leading-tight`}>{title}</p>
        </div>

        {/* Change Indicator as Pill */}
        <div className="flex items-center justify-center mt-1">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm
            ${trending === 'up' && change !== '0' ? 'bg-green-100 text-green-700' : trending === 'down' && change !== '0' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}
          >
            {trending === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{change}</span>
          </span>
        </div>
      </div>

      {/* More Details Link */}
      {onClick && (
        <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-20">
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