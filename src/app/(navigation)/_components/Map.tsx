"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import L from "leaflet";
import { Route, Vehicle } from "@/types";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { VehicleMarker } from "./VehicleMarker";

type MapProps = {
  viewDetails: (vehicle: Vehicle, route: Route) => void;
  setMapRef: React.RefObject<L.Map | null>;
};

export default function MyMap({ viewDetails, setMapRef }: MapProps) {
  const center = { lat: 40.7128, lng: -74.006 }; // NYC coords
  const zoom = 12;

  const {
    data: vehicle,
    error: vehicleError,
    isLoading: vehicleLoading,
  } = useQuery<Vehicle, Error>({
    queryKey: ["vehicle", "FRS850"],
    queryFn: async () => {
      const res = await fetch(`api/vehicles/FRS850`);
      if (!res.ok) throw new Error("Failed to fetch vehicle");
      return res.json();
    },
  });

  const {
    data: route,
    error: routeError,
    isLoading: routeLoading,
  } = useQuery<Route, Error>({
    queryKey: ["route", vehicle?.vehicleId],
    queryFn: async () => {
      if (!vehicle) throw new Error("No vehicle id");
      const res = await fetch(
        `/api/vehicles/${vehicle.vehicleId}/route-details`
      );
      if (!res.ok) throw new Error("Failed to fetch route");
      return res.json();
    },
    enabled: !!vehicle,
  });

  if (vehicleLoading || routeLoading) {
    return (
      <div className="h-full w-full bg-background flex justify-center items-center">
        <Loader2 className="size-9 animate-spin" />
      </div>
    );
  }

  if (vehicleError)
    return <div>Error loading vehicle: {vehicleError.message}</div>;
  if (routeError) return <div>Error loading route: {routeError.message}</div>;

  const createBlackCircleIcon = (size: number) => {
    const radius = size / 2;
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="width: ${size}px; height: ${size}px; background: black; border-radius: 50%; box-shadow: var(--shadow-md);">
      </div>`,
      iconSize: [size, size],
      iconAnchor: [radius, radius],
    });
  };

  const blackCircleIcon = createBlackCircleIcon(30);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-full w-full z-10 relative"
      ref={setMapRef}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="z-10"
      />

      {/* Vehicle Marker */}
      {vehicle && route && (
        <VehicleMarker
          viewDetails={() => viewDetails(vehicle, route)}
          vehicle={vehicle}
          route={route}
          icon={blackCircleIcon}
        />
      )}

      
    </MapContainer>
  );
}
