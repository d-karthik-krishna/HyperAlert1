
import React from 'react';
import { Target, Zap, Layers, Lock } from 'lucide-react';

const usps = [
  {
    icon: Target,
    title: "Hyperlocal Granularity",
    desc: "We don't alert the whole city. We alert your street."
  },
  {
    icon: Zap,
    title: "Predictive AI Models",
    desc: "Forecasting disasters hours before they become visible."
  },
  {
    icon: Layers,
    title: "Multi-Source Fusion",
    desc: "Combining satellite, ground sensors, and social data."
  },
  {
    icon: Lock,
    title: "Verified Action Plans",
    desc: "Pre-vetted evacuation routes and safety protocols."
  }
];

const USPSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Why We Are Different</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
            Traditional alerts are reactive and broad. HyperAlert is predictive and precise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-rose-100 dark:hover:border-rose-900 hover:shadow-xl hover:shadow-rose-100/20 dark:hover:shadow-none transition-all duration-300 group">
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500 dark:text-rose-400 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                <usp.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{usp.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPSection;
