
import { Alert, SafeZone, NavigationInstruction } from '../types';

export const USER_LOCATION: [number, number] = [40.7110, -74.0080];

export const SAFE_ZONES: SafeZone[] = [
  {
    id: 'sz1',
    name: 'P.S. 234 School Shelter',
    type: 'Shelter',
    location: [40.7165, -74.0100],
    distance: '0.4 mi',
    capacity: '85%'
  },
  {
    id: 'sz2',
    name: 'NY Downtown Hospital',
    type: 'Hospital',
    location: [40.7105, -74.0050],
    distance: '0.2 mi',
    capacity: '40%'
  },
  {
    id: 'sz3',
    name: 'City Hall Park Assembly',
    type: 'Assembly Point',
    location: [40.7125, -74.0065],
    distance: '0.3 mi',
    capacity: 'Open'
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: '1',
    title: 'FLASH FLOOD WARNING',
    type: 'Flood',
    severity: 'Critical',
    location: [40.7128, -74.0060], // NYC Centerish
    areaName: 'Lower Manhattan, Zone A',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    instruction: 'EVACUATE TO HIGHER GROUND. AVOID SUBWAYS.',
  },
  {
    id: '2',
    title: 'STRUCTURAL FIRE',
    type: 'Fire',
    severity: 'High',
    location: [40.7300, -73.9950],
    areaName: 'Greenwich Village',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    instruction: 'STAY CLEAR OF 5TH AVE. SMOKE HAZARD.',
  },
  {
    id: '3',
    title: 'EXTREME HEAT ALERT',
    type: 'Heatwave',
    severity: 'Moderate',
    location: [40.7580, -73.9855],
    areaName: 'Midtown',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    instruction: 'STAY INDOORS. HYDRATE.',
  },
];

export const MOCK_ROUTE: [number, number][] = [
  USER_LOCATION,
  [40.7115, -74.0080],
  [40.7115, -74.0065],
  [40.7105, -74.0050] // Hospital
];

export const MOCK_STEPS: NavigationInstruction[] = [
  {
    id: 's1',
    text: 'Head North on Church St',
    distance: '150 ft',
    icon: 'continue',
    coordinate: USER_LOCATION
  },
  {
    id: 's2',
    text: 'Turn Right onto Park Place',
    distance: '0.1 mi',
    icon: 'turn-right',
    coordinate: [40.7115, -74.0080]
  },
  {
    id: 's3',
    text: 'Turn Right toward Hospital Entrance',
    distance: '300 ft',
    icon: 'turn-right',
    coordinate: [40.7115, -74.0065]
  },
  {
    id: 's4',
    text: 'Arrive at Safe Zone',
    distance: '0 ft',
    icon: 'arrive',
    coordinate: [40.7105, -74.0050]
  }
];

// Generators for dynamic locations
export const generateRandomAlerts = (lat: number, lng: number): Alert[] => {
    const types: Alert['type'][] = ['Flood', 'Fire', 'Storm', 'Biohazard', 'Heatwave', 'Earthquake'];
    const severities: Alert['severity'][] = ['Critical', 'High', 'Moderate', 'Info'];
    
    return Array.from({ length: 4 }).map((_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        // Bias towards high severity for the first item
        const severity = severities[Math.floor(Math.random() * (i === 0 ? 2 : 4))]; 
        const offsetLat = (Math.random() - 0.5) * 0.02;
        const offsetLng = (Math.random() - 0.5) * 0.02;
        
        return {
            id: `gen-${Date.now()}-${i}`,
            title: `${type.toUpperCase()} ALERT`,
            type: type,
            severity: severity,
            location: [lat + offsetLat, lng + offsetLng],
            areaName: `Sector ${Math.floor(Math.random() * 100)}`,
            timestamp: new Date(Date.now() - Math.random() * 1000000),
            instruction: severity === 'Critical' ? 'EVACUATE IMMEDIATELY.' : 'STAY ALERT. MONITOR LOCAL SOURCES.'
        };
    });
};

export const generateSafeZones = (lat: number, lng: number): SafeZone[] => {
     return [
        {
            id: `sz-local-1-${Date.now()}`,
            name: 'Local Emergency Shelter',
            type: 'Shelter',
            location: [lat + 0.004, lng - 0.003],
            distance: '0.3 mi',
            capacity: '80%'
        },
        {
            id: `sz-local-2-${Date.now()}`,
            name: 'District Hospital',
            type: 'Hospital',
            location: [lat - 0.002, lng + 0.005],
            distance: '0.6 mi',
            capacity: '45%'
        }
     ];
};
