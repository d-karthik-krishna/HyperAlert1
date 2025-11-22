
export type Severity = 'Critical' | 'High' | 'Moderate' | 'Info';

export type DisasterType = 'Flood' | 'Fire' | 'Earthquake' | 'Storm' | 'Biohazard' | 'Heatwave';

export interface Alert {
  id: string;
  title: string;
  type: DisasterType;
  severity: Severity;
  location: [number, number]; // Lat, Lng
  areaName: string;
  timestamp: Date;
  instruction: string;
}

export interface SafeZone {
  id: string;
  name: string;
  type: 'Shelter' | 'Hospital' | 'Assembly Point';
  location: [number, number];
  distance?: string;
  capacity?: string;
}

export interface Metric {
  label: string;
  value: string;
  trend?: string;
  positive?: boolean;
}

export interface CostItem {
  category: string;
  details: string[];
  estimatedCost: string;
}

export interface NavigationInstruction {
  id: string;
  text: string;
  distance: string;
  icon: 'turn-left' | 'turn-right' | 'continue' | 'arrive';
  coordinate: [number, number];
}
