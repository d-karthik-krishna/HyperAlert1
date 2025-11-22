
import React from 'react';
import { SafeZone } from '../types';
import { Shield, Navigation, ArrowRight, Activity, MapPin } from 'lucide-react';

interface SafeZoneListProps {
  safeZones: SafeZone[];
  onSelectSafeZone: (zone: SafeZone) => void;
  selectedSafeZoneId: string | null;
}

const SafeZoneList: React.FC<SafeZoneListProps> = ({ safeZones, onSelectSafeZone, selectedSafeZoneId }) => {
  return (
    <div className="bg-white dark:bg-slate-900 h-full flex flex-col transition-colors duration-300">
      <div className="p-4 bg-slate-900 dark:bg-black text-white border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Shield className="text-emerald-500" fill="currentColor" size={20} />
          SAFE ZONES ({safeZones.length})
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-2 space-y-2 transition-colors duration-300">
        {safeZones.map(zone => {
          const isSelected = selectedSafeZoneId === zone.id;
          
          return (
            <button
              key={zone.id}
              onClick={() => onSelectSafeZone(zone)}
              className={`w-full text-left p-4 rounded-xl border-l-8 shadow-sm transition-all ${
                isSelected 
                  ? 'bg-white dark:bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20 z-10 scale-[1.02]' 
                  : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700 border-l-emerald-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {zone.type}
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Navigation size={10} /> 
                    {zone.distance}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1">
                {zone.name}
              </h3>
              
              <div className="flex items-center justify-between mt-3">
                 <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                    <Activity size={14} />
                    <span className="text-xs font-bold uppercase">Capacity: {zone.capacity}</span>
                 </div>
                 
                 {isSelected && (
                     <ArrowRight size={16} className="text-emerald-500 animate-pulse" />
                 )}
              </div>
            </button>
          );
        })}
        
        {safeZones.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                <MapPin size={32} className="mb-2 opacity-20" />
                <p className="text-sm">No safe zones nearby</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SafeZoneList;
