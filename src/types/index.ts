export interface Driver {
  id: string;
  name: string;
}

export type BatteryStatus = "charging" | "discharging" | "full";

export interface Battery {
  level: number; // 0-100
  status: BatteryStatus;
}

export interface Coordinates {
  lat: number; // double
  lng: number; // double
}

export type VehicleStatus = "active" | "inactive" | "maintenance";

export interface Vehicle {
  vehicleId: string;
  model: string;
  licensePlate: string;
  driver: Driver;
  battery: Battery;
  speed: number; // km/h
  location: Coordinates;
  status: VehicleStatus;
}

export interface Location {
  vehicleId: string;
  location: Coordinates;
  speed: number;
  heading: number; // degrees (0-360)
  timestamp: string; // ISO date-time string
  battery: Battery;
}

export type RouteStatus = "scheduled" | "in_progress" | "completed";

export type StopType = "departure" | "break" | "charging_station" | "destination";

export interface Stop {
  address: string;
  type: StopType;
  estimatedArrival: string; // ISO date-time string
  actualArrival?: string;   // ISO date-time string, optional
  duration: number;         // duration in minutes
}

export interface Route {
  routeId: string;
  vehicleId: string;
  status: RouteStatus;
  currentStopIndex: number;
  stops: Stop[];
}
