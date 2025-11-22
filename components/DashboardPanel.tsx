
import React from 'react';
import { Activity, Thermometer, Wind, Droplets, Shield, AlertTriangle, Radio } from 'lucide-react';
import { Alert, SafeZone } from '../types';

interface DashboardPanelProps {
  alerts: Alert[];
  safeZones: SafeZone[];
  onNavigate: (mode: 'alerts' | 'safe-zones') => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ alerts, safeZones, onNavigate }) => {
  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;
  
  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Radio className="text-indigo-500 animate-pulse" size={24} />
          Command Center
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time situational awareness.</p>
      </div>

      <div className="px-4 space-y-4 pb-6">
        {/* Status Card */}
        <div className={`p-6 rounded-3xl text-white shadow-lg transition-all duration-500 ${
            criticalCount > 0 
            ? 'bg-gradient-to-br from-rose-600 to-red-700 shadow-rose-500/30' 
            : alerts.length > 0 
                ? 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/30' 
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30'
        }`}>
            <div className="flex items-center gap-2 mb-2 opacity-90">
                <Activity size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">System Status</span>
            </div>
            <div className="text-2xl font-black mb-2 tracking-tight">
                {criticalCount > 0 ? "CRITICAL THREATS" : alerts.length > 0 ? "ADVISORIES ACTIVE" : "SYSTEM NOMINAL"}
            </div>
            <p className="text-sm opacity-80 font-medium leading-relaxed">
                 {criticalCount > 0 
                  ? `${criticalCount} critical incidents detected. Immediate action required.` 
                  : alerts.length > 0 
                    ? `${alerts.length} active advisories in your monitored sector.` 
                    : "No active threats detected in your immediate vicinity."}
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => onNavigate('alerts')}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-rose-200 dark:hover:border-rose-900 hover:shadow-md transition-all group text-left"
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg group-hover:scale-110 transition-transform">
                        <AlertTriangle size={18} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{alerts.length}</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase">Active Alerts</div>
            </button>

            <button 
                onClick={() => onNavigate('safe-zones')}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-900 hover:shadow-md transition-all group text-left"
            >
                 <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                        <Shield size={18} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{safeZones.length}</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase">Safe Zones</div>
            </button>
        </div>

        {/* Environmental Data */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                Env. Metrics
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500">LIVE</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100 dark:divide-slate-700">
                <div className="flex flex-col items-center gap-1">
                    <Thermometer size={20} className="text-orange-500 mb-1" />
                    <span className="text-lg font-bold text-slate-700 dark:text-slate-200">72°</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Temp</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Wind size={20} className="text-blue-500 mb-1" />
                    <span className="text-lg font-bold text-slate-700 dark:text-slate-200">8mph</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Wind</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Droplets size={20} className="text-cyan-500 mb-1" />
                    <span className="text-lg font-bold text-slate-700 dark:text-slate-200">45%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Humid</span>
                </div>
            </div>
        </div>

        {/* System Logs */}
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">System Logs</h3>
            <div className="space-y-3">
                {[
                    { time: '10:42 AM', text: 'Satellite uplink established.', type: 'info' },
                    { time: '10:38 AM', text: 'Local sensor mesh sync complete.', type: 'info' },
                    { time: '10:15 AM', text: 'Background analysis routine finished.', type: 'success' },
                ].map((log, i) => (
                    <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-mono mb-0.5">{log.time}</div>
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-snug">{log.text}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
