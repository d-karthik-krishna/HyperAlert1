
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker, Circle, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { Alert, SafeZone } from '../types';
import { MOCK_ROUTE } from '../data/mockAlerts';
import { useTheme } from '../ThemeContext';
import { ExternalLink, Navigation } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

interface MapViewProps {
  alerts: Alert[];
  safeZones: SafeZone[];
  selectedAlertId: string | null;
  selectedSafeZoneId?: string | null;
  isNavigating: boolean;
  currentLocation?: [number, number]; // For simulating movement or navigation steps
  userLocation: [number, number]; // The real or searched user location
  filterRadius?: number; // Radius in meters to visualize
}

const isValidLocation = (loc: any): loc is [number, number] => {
  return (
    Array.isArray(loc) && 
    loc.length === 2 && 
    Number.isFinite(loc[0]) && 
    Number.isFinite(loc[1])
  );
};

// Controller to handle imperative map animations and resizing
const MapController: React.FC<{ 
  center: [number, number]; 
  isNavigating: boolean;
  zoom?: number;
}> = ({ center, isNavigating, zoom }) => {
  const map = useMap();

  useEffect(() => {
    // Invalid size check
    const timer = setTimeout(() => {
       map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map, isNavigating]);

  useEffect(() => {
    if (isValidLocation(center)) {
        const targetZoom = zoom || (isNavigating ? 18 : 14);
        const currentCenter = map.getCenter();
        
        const dist = currentCenter.distanceTo(center);
        
        if (dist > 1000) { 
            map.setView(center, targetZoom, { animate: true, duration: 1 }); 
        } else {
            map.flyTo(center, targetZoom, { 
                duration: 1.0, 
                easeLinearity: 0.25 
            });
        }
    }
  }, [center, map, isNavigating, zoom]);
  
  return null;
};

// Icon Caching to prevent "_leaflet_pos" errors
const iconCache: Record<string, L.DivIcon> = {};

const getAlertIcon = (severity: string) => {
    const key = `alert-${severity}`;
    if (!iconCache[key]) {
        const color = severity === 'Critical' ? '#EF4444' : '#F97316';
        const pulseClass = severity === 'Critical' ? 'marker-pulse-ring' : '';
        
        iconCache[key] = L.divIcon({
            className: '',
            html: `
                <div class="${pulseClass} w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl" style="background-color: ${color};">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-5 h-5"><path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.28H3.73L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    }
    return iconCache[key];
};

const getSafeZoneIcon = (type: string) => {
    const key = `safezone-${type}`;
    if (!iconCache[key]) {
        const iconSvg = type === 'Hospital' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-7 h-7"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>' 
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-7 h-7"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>';

        iconCache[key] = L.divIcon({
            className: '',
            html: `
                <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl z-50">
                   ${iconSvg}
                </div>
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48]
        });
    }
    return iconCache[key];
};

const MapView: React.FC<MapViewProps> = React.memo(({ alerts, safeZones, selectedAlertId, selectedSafeZoneId, isNavigating, currentLocation, userLocation, filterRadius }) => {
  const { theme } = useTheme();
  
  const validAlerts = useMemo(() => alerts.filter(a => isValidLocation(a.location)), [alerts]);
  const validSafeZones = useMemo(() => safeZones.filter(sz => isValidLocation(sz.location)), [safeZones]);

  const activeLocation = isNavigating ? (currentLocation || userLocation) : userLocation;

  const mapCenter = useMemo(() => {
    if (isNavigating) return activeLocation;
    if (selectedAlertId) {
      const alert = validAlerts.find(a => a.id === selectedAlertId);
      return alert ? alert.location : userLocation;
    }
    if (selectedSafeZoneId) {
        const zone = validSafeZones.find(z => z.id === selectedSafeZoneId);
        return zone ? zone.location : userLocation;
    }
    return userLocation;
  }, [selectedAlertId, selectedSafeZoneId, validAlerts, validSafeZones, isNavigating, activeLocation, userLocation]);

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={userLocation} 
        zoom={14} 
        style={{ height: '100%', width: '100%', background: '#020617' }}
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={false}
      >
        <LayersControl position="bottomright">
            <LayersControl.BaseLayer checked name="Street Mode">
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url={tileUrl}
                    maxZoom={19}
                    opacity={isNavigating ? 0.8 : 1}
                />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite Mode">
                <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={18}
                />
            </LayersControl.BaseLayer>
        </LayersControl>
        
        <MapController center={mapCenter} isNavigating={isNavigating} />

        {/* Route Polyline */}
        {isNavigating && (
          <>
            <Polyline positions={MOCK_ROUTE} pathOptions={{ color: '#3B82F6', weight: 12, opacity: 0.2, lineCap: 'round' }} />
            <Polyline positions={MOCK_ROUTE} pathOptions={{ color: '#60A5FA', weight: 6, opacity: 1 }} />
          </>
        )}

        {!isNavigating && filterRadius && (
            <Circle 
                center={userLocation}
                radius={filterRadius}
                pathOptions={{ color: '#3B82F6', fillColor: '#60A5FA', fillOpacity: 0.08, weight: 1, dashArray: '6 6' }}
                eventHandlers={{ click: () => {} }} 
            />
        )}

        <CircleMarker 
          center={activeLocation} 
          radius={isNavigating ? 12 : 8} 
          pathOptions={{ color: 'white', fillColor: '#3B82F6', fillOpacity: 1, weight: 4 }}
        >
            {isNavigating && (
               <Popup autoClose={false} closeButton={false} className="bg-transparent shadow-none border-none">
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-blue-500 transform -translate-y-4"></div>
               </Popup>
            )}
        </CircleMarker>

        {/* Safe Zones */}
        {validSafeZones.map(zone => (
            <Marker 
                key={zone.id} 
                position={zone.location} 
                icon={getSafeZoneIcon(zone.type)}
                opacity={isNavigating ? (zone.type === 'Hospital' ? 1 : 0.5) : 1}
                zIndexOffset={selectedSafeZoneId === zone.id ? 1000 : 0}
            >
                <Popup>
                    <div className="p-2">
                        <div className="font-bold text-slate-900 dark:text-white text-lg">{zone.name}</div>
                        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded mt-1 text-xs font-bold uppercase">
                            {zone.type} • {zone.capacity}
                        </div>
                        <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${zone.location[0]},${zone.location[1]}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 mt-3 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded transition-colors"
                        >
                            <Navigation size={12} />
                            Get Directions (Google Maps)
                        </a>
                    </div>
                </Popup>
            </Marker>
        ))}

        {/* Alerts */}
        {!isNavigating && validAlerts.map(alert => (
          <Marker 
            key={alert.id} 
            position={alert.location}
            icon={getAlertIcon(alert.severity)}
            zIndexOffset={selectedAlertId === alert.id ? 1000 : 0}
          >
             <Popup closeButton={false} className="emergency-popup" autoPan={false}>
                <div className="p-1">
                    <div className={`${alert.severity === 'Critical' ? 'bg-red-600' : 'bg-orange-500'} text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2 shadow-sm`}>
                        {alert.severity.toUpperCase()} THREAT
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-1 text-slate-900 dark:text-white">{alert.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-2">{alert.areaName}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic p-2 bg-slate-50 dark:bg-slate-800 rounded border-l-4 border-slate-300 dark:border-slate-600">
                      "{alert.instruction}"
                    </p>
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${alert.location[0]},${alert.location[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 mt-2 w-full text-blue-600 dark:text-blue-400 text-xs font-bold py-1 hover:underline"
                    >
                        <ExternalLink size={10} />
                        View on Google Maps
                    </a>
                </div>
             </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
});

export default MapView;
