import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-green-100 animate-fade-in">
      <div className="relative flex items-center justify-center mb-4">
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-gradient-to-tr from-blue-400 to-green-400 opacity-30 blur-lg"></span>
        <svg className="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 50 50">
          <circle
            className="opacity-20"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
          />
          <circle
            className=""
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeDasharray="31.4 188.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-lg font-semibold text-blue-700 animate-pulse drop-shadow-sm">{message}</p>
    </div>
  );
};

export default Loader; 