import { Language } from '../context/AppContext';

export interface WeatherInfo {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  location: string;
  alerts: string[];
}

export type ReportCategory = 'Flood' | 'Road blockage' | 'Power outage' | 'Tree fall' | 'Landslide';

export interface CommunityReport {
  id: string;
  category: ReportCategory;
  description: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  reporterName: string;
  isValidated: boolean;
}

export type FamilyStatus = 'Safe' | 'Travelling' | 'Offline' | 'Needs Help';

export interface FamilyMember {
  id: string;
  name: string;
  status: FamilyStatus;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  avatar?: string;
  contact: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface HelpCenter {
  id: string;
  name: string;
  type: 'Hospital' | 'Police' | 'Shelter' | 'Charging Station' | 'Food Camp' | 'Fuel Station';
  latitude: number;
  longitude: number;
  address: string;
  distance: string;
  phone: string;
  availableSlots?: number;
}
