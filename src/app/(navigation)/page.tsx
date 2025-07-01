"use client";

import dynamic from "next/dynamic";
import React, { useState, useCallback, useRef } from "react";
import VehicleDetails from "./_components/VehicleDetails";
import { Route, Vehicle } from "@/types";
import MapHeader from "./_components/MapHeader";
import PositionControls from "./_components/PositionControls";

export default function Navigation() {
  const Map = dynamic(() => import("@/app/(navigation)/_components/Map"), {
    ssr: false,
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleRoute, setVehicleRoute] = useState<Route | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Memoize handler to prevent unnecessary re-renders
  const handleViewDetails = useCallback((vehicle: Vehicle, route: Route) => {
    console.log("clicked");
    setSelectedVehicle(vehicle);
    setVehicleRoute(route);
  }, []);

  return (
    <div className="flex h-full w-full">
      <VehicleDetails
        vehicle={selectedVehicle}
        route={vehicleRoute}
        onClose={() => setSelectedVehicle(null)}
      />
      <div className="w-full h-full relative">
        {/* Map is isolated from selectedVehicle state */}
        <Map viewDetails={handleViewDetails} setMapRef={mapRef}/>
        <MapHeader />
<PositionControls mapRef={mapRef} />
      </div>
    </div>
  );
}
