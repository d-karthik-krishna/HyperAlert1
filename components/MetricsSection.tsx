
import React from 'react';
import { Activity, Users, Zap, CheckCircle } from 'lucide-react';
import { Metric } from '../types';

const metrics: (Metric & { icon: any })[] = [
  { label: 'Active Users', value: '24.5k', trend: '+12% MoM', positive: true, icon: Users },
  { label: 'Prediction Accuracy', value: '94.2%', trend: 'Top 1% in sector', positive: true, icon: Activity },
  { label: 'Notification Speed', value: '< 2s', trend: 'Latency', positive: true, icon: Zap },
  { label: 'Delivery Rate', value: '99.9%', trend: 'Across all channels', positive: true, icon: CheckCircle },
];

const MetricsSection: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Built for Scale & Speed</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:shadow-none transition-all duration-300 flex flex-col items-center text-center group hover:border-indigo-100 dark:hover:border-indigo-900">
              <div className="mb-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                <metric.icon size={32} strokeWidth={1.5} />
              </div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{metric.value}</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{metric.label}</div>
              {metric.trend && (
                <div className={`text-xs font-bold py-1.5 px-3 rounded-full ${metric.positive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                  {metric.trend}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
