import React from 'react';
import {
  Baby,
  Users,
  HeartPulse,
  ShieldOff,
  AlertTriangle,
  UserCheck,
  Activity,
  TrendingDown,
  Droplets,
  Worm,
  Lungs
} from 'lucide-react';

// --- UPDATED ---
// The keys of this object now EXACTLY match the keys from the API's `health_metrics_overview` object.
// This is the critical change that makes the component work with your API data.
const metricConfig: { [key: string]: { icon: React.ElementType; label: string; color: string } } = {
  childbirths_last_month: { icon: Baby, label: 'Childbirths (Non-Institutional)', color: 'bg-blue-100 text-blue-700' },
  marriages_under_age: { icon: Users, label: 'Under Age Marriages', color: 'bg-orange-100 text-orange-700' },
  children_low_birth_weight: { icon: HeartPulse, label: 'Children with Low Birth Weight', color: 'bg-yellow-100 text-yellow-700' },
  no_immunization: { icon: ShieldOff, label: 'Incomplete Immunization', color: 'bg-purple-100 text-purple-700' },
  under_20_pregnant: { icon: AlertTriangle, label: 'Pregnant Mothers (Under 20)', color: 'bg-pink-100 text-pink-700' },
  teenage_pregnancy: { icon: UserCheck, label: 'Registered Teenage Pregnancies', color: 'bg-indigo-100 text-indigo-700' },
  high_risk_pregnancy: { icon: Activity, label: 'High-Risk Pregnancies', color: 'bg-red-100 text-red-700' },
  malnourished_children: { icon: TrendingDown, label: 'Malnourished Children', color: 'bg-orange-100 text-orange-700' },
  severely_underweight: { icon: TrendingDown, label: 'Severely Underweight Children', color: 'bg-red-100 text-red-700' },
  anemic_adolescent_girls: { icon: Droplets, label: 'Anemic Adolescent Girls', color: 'bg-rose-100 text-rose-700' },
  infectious_diseases: { icon: HeartPulse, label: 'Infectious Diseases', color: 'bg-red-100 text-red-700' },
  tb_leprosy: { icon: HeartPulse, label: 'TB & Leprosy Cases', color: 'bg-slate-100 text-slate-700' },
};

interface MetricsSectionProps {
  data: { [key: string]: number } | null;
  isLoading: boolean;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ data, isLoading }) => {
  // This logic correctly filters the keys from the 'data' prop that exist in our 'metricConfig'.
  const metrics = data ? Object.keys(data)
    .filter(key => metricConfig[key]) // This check is what makes it work
    .map(key => ({ ...metricConfig[key], value: data[key] })) : [];

  // Skeleton loader for when data is being fetched.
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
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
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