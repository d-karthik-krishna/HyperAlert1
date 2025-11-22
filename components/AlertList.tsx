
import React, { useMemo } from 'react';
import { Alert } from '../types';
import { AlertTriangle, ArrowRight, Clock, MapPin } from 'lucide-react';

interface AlertListProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  selectedAlertId: string | null;
  isNavigating: boolean;
}

const AlertList: React.FC<AlertListProps> = React.memo(({ alerts, onSelectAlert, selectedAlertId, isNavigating }) => {
  // Memoize sorted alerts to avoid sorting on every render
  const sortedAlerts = useMemo(() => {
    return [...alerts].sort((a, b) => {
      return a.severity === 'Critical' ? -1 : 1;
    });
  }, [alerts]);

  if (isNavigating) return null; // Hide list during navigation

  return (
    <div className="bg-white dark:bg-slate-900 h-full flex flex-col transition-colors duration-300">
      <div className="p-4 bg-slate-900 dark:bg-black text-white border-b border-slate-800 dark:border-slate-800">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <AlertTriangle className="text-red-500" fill="currentColor" />
          ACTIVE ALERTS ({alerts.length})
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-2 space-y-2 transition-colors duration-300">
        {sortedAlerts.map(alert => {
          const isSelected = selectedAlertId === alert.id;
          const isCritical = alert.severity === 'Critical';
          
          return (
            <button
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className={`w-full text-left p-4 rounded-xl border-l-8 shadow-sm transition-all ${
                isSelected 
                  ? 'bg-white dark:bg-slate-800 border-slate-900 dark:border-white ring-2 ring-slate-900 dark:ring-white z-10 scale-[1.02]' 
                  : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700'
              } ${isCritical ? 'border-l-red-600' : 'border-l-orange-500'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    isCritical ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {alert.severity}
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock size={10} /> 
                    {alert.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1">
                {alert.title}
              </h3>
              
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-3">
                <MapPin size={12} />
                <span className="truncate">{alert.areaName}</span>
              </div>

              {isSelected && (
                 <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold animate-pulse">
                    <span>Tap to view actions</span>
                    <ArrowRight size={16} />
                 </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default AlertList;
