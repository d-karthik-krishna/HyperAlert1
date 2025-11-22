
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, Home, Navigation, Volume2, VolumeX, 
  ArrowRight, MapPin, Phone, ShieldCheck, ChevronRight, 
  ArrowUpRight, ArrowLeft, Move, Search, Crosshair, Loader2, Check,
  Filter, SlidersHorizontal, Droplets, User, X, Edit2,
  LayoutDashboard, Bell, Shield, Settings, LogOut, Radio, Menu,
  ExternalLink
} from 'lucide-react';
import MapView from '../components/MapView';
import AlertList from '../components/AlertList';
import SafeZoneList from '../components/SafeZoneList';
import DashboardPanel from '../components/DashboardPanel';
import { IconWhyUs, IconHowItWorks, IconBusiness } from '../components/CustomIcons';
import { 
    INITIAL_ALERTS, SAFE_ZONES, MOCK_STEPS, USER_LOCATION, 
    generateRandomAlerts, generateSafeZones, MOCK_ROUTE 
} from '../data/mockAlerts';
import { Alert, NavigationInstruction, SafeZone, DisasterType } from '../types';
import { useTheme } from '../ThemeContext';

// Helper for Voice Synthesis
const speak = (text: string, enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  window.speechSynthesis.cancel(); // Stop previous
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.1;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

// Helper for Vibration
const vibrate = (pattern: number[]) => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// Helper for Distance (Haversine Formula)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const DISASTER_TYPES: (DisasterType | 'All' | 'Water')[] = ['All', 'Water', 'Flood', 'Fire', 'Earthquake', 'Storm', 'Biohazard', 'Heatwave'];

type ViewMode = 'dashboard' | 'detail' | 'navigation';
type SidebarMode = 'dashboard' | 'alerts' | 'safe-zones';

const Demo: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [safeZones, setSafeZones] = useState<SafeZone[]>(SAFE_ZONES);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedSafeZoneId, setSelectedSafeZoneId] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('dashboard');

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Location State
  const [userLocation, setUserLocation] = useState<[number, number]>(USER_LOCATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Navigation State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [simulatedLocation, setSimulatedLocation] = useState<[number, number]>(USER_LOCATION);
  const [isSafe, setIsSafe] = useState(false);

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<DisasterType | 'All' | 'Water'>('All');
  const [filterRadius, setFilterRadius] = useState<number>(10000); // meters

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);
  const currentStep = MOCK_STEPS[currentStepIndex];

  // --- Filter Logic ---
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
        // Filter by Type (Treat 'Water' as 'Flood')
        if (filterType !== 'All') {
            if (filterType === 'Water' && alert.type !== 'Flood') return false;
            if (filterType !== 'Water' && alert.type !== filterType) return false;
        }
        
        // Filter by Distance (meters)
        const distKm = getDistance(userLocation[0], userLocation[1], alert.location[0], alert.location[1]);
        const distMeters = distKm * 1000;
        
        if (distMeters > filterRadius) return false;
        
        return true;
    });
  }, [alerts, filterType, filterRadius, userLocation]);

  const filteredSafeZones = useMemo(() => {
    return safeZones.filter(zone => {
        const distKm = getDistance(userLocation[0], userLocation[1], zone.location[0], zone.location[1]);
        const distMeters = distKm * 1000;
        return distMeters <= filterRadius;
    });
  }, [safeZones, filterRadius, userLocation]);

  // --- Logic Handlers ---

  const refreshDataForLocation = useCallback((lat: number, lng: number) => {
      // Validate coordinates before generating to prevent crashes
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const newAlerts = generateRandomAlerts(lat, lng);
      const newSafeZones = generateSafeZones(lat, lng);
      setAlerts(newAlerts);
      setSafeZones(newSafeZones);
      setSelectedAlertId(null);
      setSelectedSafeZoneId(null);
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
            setUserLocation([latitude, longitude]);
            setSimulatedLocation([latitude, longitude]); // Reset nav start point
            refreshDataForLocation(latitude, longitude);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
        alert('Could not get your location. Please enable permissions.');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            
            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                setUserLocation([lat, lon]);
                setSimulatedLocation([lat, lon]);
                refreshDataForLocation(lat, lon);
                setSearchQuery('');
            } else {
                throw new Error("Invalid coordinates");
            }
        } else {
            alert('Location not found');
        }
    } catch (err) {
        console.error(err);
        alert('Search failed. Please try again.');
    } finally {
        setIsSearching(false);
    }
  };

  const handleAlertSelect = useCallback((alert: Alert) => {
    setSelectedAlertId(alert.id);
    setSelectedSafeZoneId(null);
    setViewMode('detail');
    if (alert.severity === 'Critical') {
        vibrate([500, 200, 500]); // Urgent pulse
    }
  }, []);

  const handleSafeZoneSelect = useCallback((zone: SafeZone) => {
    setSelectedSafeZoneId(zone.id);
    setSelectedAlertId(null);
    // Map auto-centers due to MapView prop change
  }, []);

  const handleStartEvacuation = useCallback(() => {
    setViewMode('navigation');
    setCurrentStepIndex(0);
    setSimulatedLocation(userLocation); // Start from current user location
    vibrate([200]);
    speak(`Evacuation started. ${MOCK_STEPS[0].text}`, voiceEnabled);
  }, [voiceEnabled, userLocation]);

  const handleExitNavigation = useCallback(() => {
    setViewMode('dashboard');
    setSelectedAlertId(null);
    setIsSafe(false); // Reset safe state
    window.speechSynthesis.cancel();
  }, []);

  const handleMarkSafe = useCallback(() => {
    setIsSafe(true);
    vibrate([100, 50, 100]); // Success vibration pattern
    if (voiceEnabled) {
        speak("Safety status updated. Contacts notified.", true);
    }
    
    // Automatically exit navigation after a delay
    setTimeout(() => {
        handleExitNavigation();
    }, 2500);
  }, [voiceEnabled, handleExitNavigation]);

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < MOCK_STEPS.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setSimulatedLocation(MOCK_STEPS[nextIndex].coordinate); // Snap to next point
        speak(MOCK_STEPS[nextIndex].text, voiceEnabled);
        vibrate([100]);
    }
  }, [currentStepIndex, voiceEnabled]);

  const simulateAlert = useCallback(() => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      title: 'TSUNAMI WARNING',
      type: 'Flood',
      severity: 'Critical',
      location: [userLocation[0] + (Math.random() - 0.5) * 0.01, userLocation[1] + (Math.random() - 0.5) * 0.01],
      areaName: 'Coastal Zone B',
      timestamp: new Date(),
      instruction: 'SEEK HIGHER GROUND IMMEDIATELY > 50FT.',
    };
    setAlerts(prev => [newAlert, ...prev]);
    vibrate([1000, 500, 1000]);
  }, [userLocation]);

  // --- UI Helpers ---

  const SidebarItem = ({ icon: Icon, label, active = false, onClick, href, count, isAction = false }: any) => {
    const Wrapper = href ? 'a' : 'button';
    const actionColorClass = isAction ? 'from-rose-500 to-orange-600 shadow-rose-500/50' : 'from-indigo-500 to-purple-600 shadow-indigo-500/50';
    
    return (
      <Wrapper
        href={href}
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden mb-1 text-left
          ${active ? 'bg-white dark:bg-white/5 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
      >
         {/* Premium Icon Box with Soft Glow */}
         <div className={`
            relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shrink-0
            ${active 
              ? `bg-gradient-to-br ${actionColorClass} text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]` 
              : `bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-gradient-to-br group-hover:${actionColorClass} group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]`
            }
         `}>
            <Icon size={20} strokeWidth={2} />
         </div>
         
         <span className={`font-bold text-sm tracking-wide transition-colors duration-300 whitespace-nowrap
            ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}
         `}>
            {label}
         </span>
         
         {count && (
           <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/30">
             {count}
           </span>
         )}
      </Wrapper>
    );
  };

  // --- Render Sub-Components ---

  const renderProfileModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header / Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 relative">
            <button 
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Avatar & Basic Info */}
        <div className="px-8 pb-8 relative">
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-xl ring-4 ring-white/10 dark:ring-black/10">
                     <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden relative">
                        <User size={64} strokeWidth={1.5} />
                     </div>
                </div>
                <button className="mb-4 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                    <Edit2 size={14} />
                    Edit Profile
                </button>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Alex Chen</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Resident • Lower Manhattan, Zone A
            </p>

            {/* Details Grid */}
            <div className="space-y-4">
                <div className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                        <Phone size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact Number</div>
                        <div className="text-base font-bold text-slate-700 dark:text-slate-200 tracking-tight">+1 (555) 019-2834</div>
                    </div>
                </div>

                <div className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm">
                        <MapPin size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Address</div>
                        <div className="text-base font-bold text-slate-700 dark:text-slate-200 tracking-tight">124 Ludlow St, New York, NY</div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Member since 2024</span>
                    <span className="text-emerald-500 font-bold">Verified Account</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex h-full bg-slate-50 dark:bg-slate-950">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="p-6 flex items-center gap-3 mb-2">
                <div className="bg-rose-500 text-white p-2.5 rounded-2xl shadow-lg shadow-rose-500/30">
                    <Radio size={24} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">HyperAlert</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-8 py-4 overflow-y-auto custom-scrollbar">
                
                {/* Primary Navigation */}
                <div>
                    <div className="px-2 mb-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest opacity-70">Overview</div>
                    <SidebarItem 
                        icon={LayoutDashboard} 
                        label="Dashboard" 
                        active={sidebarMode === 'dashboard'} 
                        onClick={() => {
                            setSidebarMode('dashboard');
                            setSelectedAlertId(null);
                            setSelectedSafeZoneId(null);
                        }} 
                    />
                    <SidebarItem 
                        icon={Bell} 
                        label="Active Alerts" 
                        active={sidebarMode === 'alerts'}
                        count={filteredAlerts.length > 0 ? filteredAlerts.length : undefined}
                        onClick={() => {
                            setSidebarMode('alerts');
                            setSelectedAlertId(null);
                        }}
                    />
                    <SidebarItem 
                        icon={Shield} 
                        label="Safe Zones" 
                        active={sidebarMode === 'safe-zones'}
                        onClick={() => {
                            setSidebarMode('safe-zones');
                            setSelectedSafeZoneId(null);
                        }}
                    />
                </div>

                {/* Company / Platform Section (Requested Items) */}
                <div>
                    <div className="px-2 mb-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest opacity-70">Platform</div>
                    
                    {/* Report Incident - Alert Triangle */}
                    <Link to="/report">
                        <SidebarItem icon={AlertTriangle} label="Report Incident" isAction={true} />
                    </Link>
                    
                    {/* Why Us - Custom Shield Icon */}
                    <SidebarItem icon={IconWhyUs} label="Why Us" href="/#why-us" />
                    
                    {/* How It Works - Custom Gear/Flow Icon */}
                    <SidebarItem icon={IconHowItWorks} label="How It Works" href="/#how-it-works" />
                    
                    {/* Business - Custom Chart Icon */}
                    <SidebarItem icon={IconBusiness} label="Business" href="/#business" />
                </div>

                {/* Account Section */}
                <div>
                    <div className="px-2 mb-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest opacity-70">System</div>
                    <SidebarItem icon={User} label="Profile" onClick={() => setIsProfileOpen(true)} />
                    <SidebarItem icon={Settings} label="Settings" />
                </div>

            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 hover:shadow-md transition-all font-bold text-sm">
                    <LogOut size={18} />
                    <span>Exit Dashboard</span>
                </Link>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <div className="flex flex-col z-20 shadow-sm">
                <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center justify-between w-full md:w-auto gap-3">
                        {/* Mobile Only Exit (Sidebar handles desktop) */}
                        <Link to="/" className="md:hidden flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <Home size={20} />
                            <span className="font-bold hidden sm:block">Exit</span>
                        </Link>
                    
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 md:w-64 relative">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search area..." 
                            className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        {isSearching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />}
                    </form>

                    <button 
                        onClick={handleLocateMe}
                        disabled={isLocating}
                        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
                        title="Use my location"
                    >
                        {isLocating ? <Loader2 size={20} className="animate-spin" /> : <Crosshair size={20} />}
                    </button>

                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        title="Filters"
                    >
                        <Filter size={20} />
                    </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button onClick={simulateAlert} className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-full font-bold whitespace-nowrap">
                        + Sim Alert
                    </button>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        LIVE
                    </div>
                    {/* Profile Trigger */}
                    <button 
                        onClick={() => setIsProfileOpen(true)}
                        className="ml-2 w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all group"
                    >
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center group-hover:bg-transparent transition-colors">
                            <User size={20} className="text-slate-700 dark:text-white group-hover:text-white transition-colors" />
                        </div>
                    </button>
                    </div>
                </div>

                {/* Filter Bar */}
                {showFilters && (
                    <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-3 px-4 flex flex-wrap items-center gap-6 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Filter size={12} /> Type</span>
                        <div className="relative">
                            <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="px-3 py-1.5 pr-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                {DISASTER_TYPES.map(t => (
                                    <option key={t} value={t}>{t === 'Water' ? 'Water / Flood' : t}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1 min-w-[200px] max-w-md">
                        <span className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap flex items-center gap-1">
                            <SlidersHorizontal size={12} /> 
                            Radius: <span className="text-blue-600 dark:text-blue-400">{filterRadius < 1000 ? `${filterRadius} m` : `${(filterRadius / 1000).toFixed(1)} km`}</span>
                        </span>
                        <input 
                            type="range" 
                            min="100" 
                            max="20000" 
                            step="100"
                            value={filterRadius}
                            onChange={(e) => setFilterRadius(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                    
                    <div className="ml-auto text-xs font-medium text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                        Showing {filteredAlerts.length} alerts
                    </div>
                    </div>
                )}
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Interactive List Panel - Switches based on Sidebar Mode */}
                <div className="w-full md:w-[400px] h-1/2 md:h-full overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {sidebarMode === 'dashboard' && (
                        <DashboardPanel 
                            alerts={filteredAlerts} 
                            safeZones={filteredSafeZones} 
                            onNavigate={(mode) => {
                                setSidebarMode(mode);
                                setSelectedAlertId(null);
                                setSelectedSafeZoneId(null);
                            }} 
                        />
                    )}
                    {sidebarMode === 'alerts' && (
                        <>
                            <AlertList 
                                alerts={filteredAlerts} 
                                onSelectAlert={handleAlertSelect} 
                                selectedAlertId={selectedAlertId}
                                isNavigating={false}
                            />
                            {filteredAlerts.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-400 p-8 text-center">
                                    <Droplets size={40} className="mb-2 opacity-20" />
                                    <p className="text-sm">No alerts found in this range.</p>
                                    <button onClick={() => setFilterRadius(20000)} className="text-xs text-blue-500 hover:underline mt-2">Expand Radius</button>
                                </div>
                            )}
                        </>
                    )}
                    {sidebarMode === 'safe-zones' && (
                        <SafeZoneList 
                            safeZones={filteredSafeZones}
                            onSelectSafeZone={handleSafeZoneSelect}
                            selectedSafeZoneId={selectedSafeZoneId}
                        />
                    )}
                </div>
                
                <div className="flex-1 h-1/2 md:h-full relative">
                    <MapView 
                        alerts={filteredAlerts} 
                        safeZones={filteredSafeZones} 
                        selectedAlertId={selectedAlertId}
                        selectedSafeZoneId={selectedSafeZoneId}
                        isNavigating={false} 
                        userLocation={userLocation}
                        filterRadius={filterRadius}
                    />
                </div>
            </div>
        </div>
    </div>
  );

  const renderDetailView = () => {
    if (!selectedAlert) return null;
    const isCritical = selectedAlert.severity === 'Critical';

    return (
        <div className="h-full flex flex-col bg-slate-900 text-white relative overflow-hidden">
            {/* Flashing Background for Critical Alerts */}
            {isCritical && <div className="absolute inset-0 pointer-events-none animate-urgent-flash z-0"></div>}
            
            {/* Top Bar */}
            <div className="relative z-10 bg-black/40 backdrop-blur-md p-4 flex items-center gap-4 border-b border-white/10">
                <button onClick={() => setViewMode('dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <div className="text-xs font-bold opacity-70 uppercase tracking-widest">Incident Report</div>
                    <div className="font-bold text-lg">{selectedAlert.type.toUpperCase()} IN PROGRESS</div>
                </div>
            </div>

            {/* Map Preview */}
            <div className="flex-1 relative z-0">
                 <MapView 
                    alerts={alerts} 
                    safeZones={safeZones} 
                    selectedAlertId={selectedAlertId}
                    selectedSafeZoneId={null}
                    isNavigating={false} 
                    userLocation={userLocation}
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
            </div>

            {/* Bottom Action Sheet */}
            <div className="relative z-20 bg-slate-900 border-t border-white/10 p-6 pb-10 rounded-t-3xl -mt-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="w-16 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>
                
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className={`text-3xl font-black mb-2 leading-tight ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>
                            {selectedAlert.title}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400">
                            <MapPin size={16} />
                            <span className="font-mono uppercase text-sm tracking-wide">{selectedAlert.areaName}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-slate-500 uppercase">Severity</div>
                        <div className={`text-xl font-black uppercase ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>
                            {selectedAlert.severity}
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border-l-4 border-white/30 mb-8">
                    <p className="text-lg font-medium leading-snug">
                        "{selectedAlert.instruction}"
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleStartEvacuation}
                        className={`w-full py-5 rounded-2xl font-black text-xl tracking-wide shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-3
                        ${isCritical ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                    >
                        <Navigation size={28} fill="currentColor" />
                        START EVACUATION
                    </button>
                    
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedAlert.location[0]},${selectedAlert.location[1]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-4 rounded-xl font-bold text-lg bg-slate-800 text-white border border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                    >
                        <MapPin size={20} />
                        View on Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
  };

  const renderNavigationView = () => (
    <div className="h-full flex flex-col bg-slate-950 relative">
        {/* Top Guidance HUD */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 pb-6 rounded-b-3xl shadow-2xl">
            <div className="flex justify-between items-start mb-4">
                <button onClick={handleExitNavigation} className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">
                    End Route
                </button>
                <div className="flex items-center gap-3">
                    <a 
                        href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${MOCK_ROUTE[MOCK_ROUTE.length-1][0]},${MOCK_ROUTE[MOCK_ROUTE.length-1][1]}&travelmode=walking`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700"
                        title="Open in Google Maps"
                    >
                        <ExternalLink size={20} />
                    </a>
                    <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-slate-400 hover:text-white">
                        {voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="bg-emerald-500 text-slate-900 p-4 rounded-2xl shadow-lg shadow-emerald-500/20">
                    {currentStep.icon === 'turn-right' && <ArrowUpRight size={40} strokeWidth={3} className="transform rotate-45" />}
                    {currentStep.icon === 'turn-left' && <ArrowUpRight size={40} strokeWidth={3} className="transform -rotate-45" />}
                    {currentStep.icon === 'continue' && <ArrowUpRight size={40} strokeWidth={3} />}
                    {currentStep.icon === 'arrive' && <ShieldCheck size={40} strokeWidth={3} />}
                </div>
                <div>
                    <div className="text-5xl font-black text-white mb-1 tracking-tighter">{currentStep.distance}</div>
                    <div className="text-xl font-medium text-slate-300 leading-tight max-w-[200px]">{currentStep.text}</div>
                </div>
            </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative z-0">
             <MapView 
                alerts={alerts} 
                safeZones={safeZones} 
                selectedAlertId={selectedAlertId} 
                selectedSafeZoneId={null}
                isNavigating={true} 
                currentLocation={simulatedLocation}
                userLocation={userLocation}
            />
            
            {/* Next Step Simulation Button (Hidden functionality for demo purposes) */}
            <div className="absolute bottom-32 right-4 z-20">
                 <button 
                    onClick={handleNextStep}
                    disabled={currentStepIndex >= MOCK_STEPS.length - 1}
                    className="bg-slate-800/80 backdrop-blur text-white p-3 rounded-full border border-slate-700 shadow-lg disabled:opacity-50"
                 >
                    <Move size={24} />
                 </button>
            </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-slate-900 p-4 pt-6 pb-8 rounded-t-3xl border-t border-slate-800">
            <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl transition-colors border border-slate-700">
                    <Phone className="text-emerald-500" size={28} />
                    <span className="font-bold text-white text-sm">Emergency 911</span>
                </button>
                
                <button 
                    onClick={handleMarkSafe}
                    disabled={isSafe}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 border relative overflow-hidden group ${
                        isSafe 
                        ? 'bg-emerald-600 border-emerald-500' 
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                    }`}
                >
                    <div className={`transition-transform duration-300 ${isSafe ? 'scale-110' : ''}`}>
                        {isSafe ? <Check className="text-white" size={28} strokeWidth={3} /> : <ShieldCheck className="text-blue-500" size={28} />}
                    </div>
                    <span className="font-bold text-white text-sm relative z-10">
                        {isSafe ? "Marked Safe" : "Mark I'm Safe"}
                    </span>
                    {isSafe && <span className="absolute inset-0 bg-emerald-400 opacity-20 animate-pulse"></span>}
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="h-[100dvh] overflow-hidden font-sans">
      {viewMode === 'dashboard' && renderDashboard()}
      {viewMode === 'detail' && renderDetailView()}
      {viewMode === 'navigation' && renderNavigationView()}
      {isProfileOpen && renderProfileModal()}
    </div>
  );
};

export default Demo;
