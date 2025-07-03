"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import React from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import type { Vehicle, Route } from "@/types";
import { VehicleMarker } from "./VehicleMarker";
import RoutingComponent from "./RoutingComponent";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MapProps = {
  viewDetails: (vehicleId: string) => void;
  setMapRef: React.RefObject<L.Map | null>;
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  showRouting: boolean;
  route?: Route | null;
  setIsGeocodingLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MyMap({
  viewDetails,
  setMapRef,
  vehicles,
  selectedVehicleId,
  showRouting,
  route,
  setIsGeocodingLoading,
}: MapProps) {
  const defaultCenter = { lat: 40.7128, lng: -74.006 };
  const defaultZoom = 12;

  const createBlackCircleIcon = (size: number) => {
    const radius = size / 2;
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="width: ${size}px; height: ${size}px; background: black; border-radius: 50%; box-shadow: var(--shadow-md);"></div>`,
      iconSize: [size, size],
      iconAnchor: [radius, radius],
    });
  };

  const defaultIcon = createBlackCircleIcon(24);
  const selectedIcon = createBlackCircleIcon(32);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom
      className="h-full w-full z-10 relative"
      ref={(mapInstance) => {
        if (mapInstance) setMapRef.current = mapInstance;
      }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        className="z-10 map-tiles"
      />

      {vehicles.map((vehicle) => (
        <VehicleMarker
          key={vehicle.vehicleId}
          viewDetails={() => viewDetails(vehicle.vehicleId)}
          vehicle={vehicle}
          icon={
            vehicle.vehicleId === selectedVehicleId ? selectedIcon : defaultIcon
          }
        />
      ))}

      {showRouting && route && (
        <RoutingComponent
          onGeocodingLoading={setIsGeocodingLoading}
          route={route}
          showRouting={showRouting}
        />
      )}
    </MapContainer>
  );
}
