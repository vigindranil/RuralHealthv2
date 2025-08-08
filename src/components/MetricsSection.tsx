import React from 'react';
import { Baby, Users, Heart, Shield, AlertTriangle, UserCheck, Activity, TrendingDown } from 'lucide-react';

const metricConfig: { [key: string]: { icon: React.ElementType; label: string; color: string } } = {
  Childbirths_Last_Month_NonInstitutional: { icon: Baby, label: 'Childbirths (Last One Month) - Only Non-Institutional Births', color: 'bg-red-100 text-red-700' },
  Marriages_Under_Age: { icon: Users, label: 'Marriages - Under Age', color: 'bg-orange-100 text-orange-700' },
  Children_Low_Birth_Weight: { icon: Heart, label: 'Children with low birth weight', color: 'bg-yellow-100 text-yellow-700' },
  Children_No_Immunization: { icon: Shield, label: 'Children who have not completed immunization', color: 'bg-purple-100 text-purple-700' },
  Under_20_Pregnant_Mothers: { icon: AlertTriangle, label: 'Under 20 years of age pregnant mothers', color: 'bg-pink-100 text-pink-700' },
  Teenage_Pregnancy_Registered: { icon: UserCheck, label: 'Teenage pregnancy registered', color: 'bg-indigo-100 text-indigo-700' },
  High_Risk_Pregnancies: { icon: Activity, label: 'Pregnant women with high-risk pregnancy', color: 'bg-red-100 text-red-700' },
  Malnourished_Children: { icon: TrendingDown, label: 'Malnourished Children', color: 'bg-orange-100 text-orange-700' },
  Severely_Underweight: { icon: TrendingDown, label: 'Severely Underweight children', color: 'bg-red-100 text-red-700' },
};

interface MetricsSectionProps {
  data: { [key: string]: number } | null;
  isLoading: boolean;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ data, isLoading }) => {
  const metrics = data ? Object.keys(data)
    .filter(key => metricConfig[key])
    .map(key => ({ ...metricConfig[key], value: data[key] })) : [];

  const renderSkeletons = () => (
    Array.from({ length: 9 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-gray-200 w-9 h-9"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    ))
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Metrics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? renderSkeletons() : metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-1">{metric.label}</h3>
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && metrics.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-10">No metric data available for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default MetricsSection;