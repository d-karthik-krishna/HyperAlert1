
import React from 'react';
import { Satellite, Brain, Bell, MapPin } from 'lucide-react';

const steps = [
  {
    icon: Satellite,
    title: "Data Fusion",
    desc: "Ingest real-time weather & satellite data."
  },
  {
    icon: Brain,
    title: "Risk Detection",
    desc: "AI models predict hazards at street level."
  },
  {
    icon: MapPin,
    title: "Micro-Targeting",
    desc: "Identify exact households in danger zones."
  },
  {
    icon: Bell,
    title: "Action Alert",
    desc: "Send life-saving instructions instantly."
  }
];

const FlowSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">From Orbit to Your Pocket</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Our pipeline transforms raw planetary data into personalized survival instructions in milliseconds.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-16 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-100 dark:via-indigo-900 to-transparent -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {steps.map((step, idx) => (
              <div key={idx} className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:bg-slate-800 transition-all duration-500 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-lg shadow-indigo-100 dark:shadow-none border border-indigo-50 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <step.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{step.desc}</p>
                
                {/* Mobile connector */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden absolute -bottom-10 left-1/2 w-0.5 h-10 bg-indigo-100 dark:bg-indigo-900 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowSection;
