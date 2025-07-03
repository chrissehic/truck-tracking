// Base types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Driver {
  id: string;
  name: string;
}

export interface Battery {
  level: number; // 0-100
  status: 'charging' | 'discharging' | 'full';
}

export interface Vehicle {
  vehicleId: string;
  model: string;
  licensePlate: string;
  driver: Driver;
  battery: Battery;
  speed: number; // km/h
  location: Coordinates;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface LocationUpdate {
  vehicleId: string;
  location: Coordinates;
  speed: number; // km/h
  heading: number; // 0-360 degrees
  timestamp: string; // ISO 8601
  battery: Battery;
}

export interface Stop {
  address: string;
  type: 'departure' | 'break' | 'charging_station' | 'destination';
  estimatedArrival: string; // ISO 8601
  actualArrival?: string; // ISO 8601
  duration: number; // minutes
}

export interface Route {
  routeId: string;
  vehicleId: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  currentStopIndex: number;
  stops: Stop[];
}

export interface WebSocketInfo {
  wsUrl: string;
  token: string;
}

export interface SubscribeRequest {
  vehicleId: string;
  updateInterval?: number; // seconds
}
