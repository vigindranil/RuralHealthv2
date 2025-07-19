import React, { useState } from 'react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

interface ChartCardProps {
  title: string;
  type: 'line' | 'bar';
  data: ChartData;
}

export default function ChartCard({ title, type, data }: ChartCardProps) {
  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
  const [hovered, setHovered] = useState<{ label: string; datasetIndex: number; value: number; x: number; y: number } | null>(null);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-green-50 rounded-2xl shadow-lg p-8 border border-blue-100">
      <h3 className="text-xl font-bold text-blue-900 mb-6 drop-shadow">{title}</h3>
      <div className="relative h-64 flex items-end justify-between space-x-4">
        {data.labels.map((label, index) => (
          <div key={label} className="flex-1 flex flex-col items-center group relative">
            <div className="w-full flex flex-col items-center space-y-1 mb-2">
              {data.datasets.map((dataset, datasetIndex) => {
                const height = (dataset.data[index] / maxValue) * 200;
                return (
                  <div
                    key={dataset.label}
                    className="w-7 mx-auto rounded-t-xl transition-all duration-700 ease-out relative cursor-pointer"
                    style={{
                      height: `${height}px`,
                      background: `linear-gradient(135deg, ${dataset.color} 60%, #fff 100%)`,
                      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)',
                      opacity: type === 'bar' ? 0.9 : 1
                    }}
                    onMouseEnter={e => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setHovered({
                        label,
                        datasetIndex,
                        value: dataset.data[index],
                        x: rect.left + rect.width / 2,
                        y: rect.top
                      });
                    }}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}
            </div>
            <span className="text-xs text-gray-500 text-center mt-1">{label}</span>
          </div>
        ))}
        {/* Tooltip */}
        {hovered && (
          <div
            className="pointer-events-none fixed z-50"
            style={{ left: hovered.x, top: hovered.y - 40, transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-white/90 border border-blue-200 rounded-lg px-4 py-2 shadow-xl text-blue-900 font-semibold text-sm animate-fade-in">
              <span>{data.datasets[hovered.datasetIndex].label}: </span>
              <span className="text-blue-700 font-bold">{hovered.value}</span>
            </div>
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-6">
        {data.datasets.map((dataset) => (
          <div key={dataset.label} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{ background: `linear-gradient(135deg, ${dataset.color} 60%, #fff 100%)` }}
            />
            <span className="text-base text-blue-700 font-medium">{dataset.label}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.2s ease; }
      `}</style>
    </div>
  );
}