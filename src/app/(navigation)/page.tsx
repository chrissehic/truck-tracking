"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import VehicleDetails from "./_components/VehicleDetails";
import type { Route, Vehicle } from "@/types";
import MapHeader from "./_components/MapHeader";
import PositionControls from "./_components/PositionControls";
import { Loader2 } from "lucide-react";
import type L from "leaflet";

export default function Navigation() {
  const Map = dynamic(() => import("@/app/(navigation)/_components/Map"), {
    ssr: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedVehicleId = searchParams.get("vehicleId");
  const showDetails = !!selectedVehicleId;
  const showRouting = showDetails;
  const mapRef = useRef<L.Map | null>(null);

  // Single mock vehicle
  const mockVehicleId = "FRS850";

  // Fetch the single mock vehicle
  const {
    data: vehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useQuery<Vehicle>({
    queryKey: ["vehicle", mockVehicleId],
    queryFn: async () => {
      const res = await fetch(`/api/vehicles/${mockVehicleId}`);
      if (!res.ok) throw new Error("Failed to fetch vehicle");
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  // Create a vehicles array with just our mock vehicle
  const vehicles = vehicle ? [vehicle] : [];
  const selectedVehicle =
    selectedVehicleId === mockVehicleId ? vehicle : undefined;

  // Fetch route for the selected vehicle
  const {
    data: route,
    isLoading: routeLoading,
    error: routeError,
  } = useQuery<Route>({
    queryKey: ["route", selectedVehicleId],
    queryFn: async () => {
      if (!selectedVehicleId) throw new Error("No vehicle selected");
      const res = await fetch(
        `/api/vehicles/${selectedVehicleId}/route-details`
      );

      if (!res.ok) throw new Error("Failed to fetch route");
      return res.json();
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedVehicleId,
  });

  const handleViewDetails = useCallback(
    (vehicleId: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("vehicleId", vehicleId);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleCloseDetails = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("vehicleId");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  if (vehicleLoading || routeLoading) {
    return (
      <div className="h-full w-full bg-background flex justify-center items-center">
        <Loader2 className="size-9 animate-spin" />
      </div>
    );
  }

  if (vehicleError || routeError) {
    return (
      <div className="h-full w-full bg-background flex justify-center items-center text-red-500">
        {vehicleError?.message || routeError?.message}
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full">
      <div className="absolute top-0 left-0 right-0 w-full h-[4px] animate-pulse bg-secondary drop-shadow-secondary drop-shadow-lg z-40"></div>

      {selectedVehicleId && (
        <VehicleDetails
          vehicle={selectedVehicle}
          route={route}
          isOpen={showDetails}
          onClose={handleCloseDetails}
          vehicleId={selectedVehicleId!}
        />
      )}
      <div className="w-full h-full relative">
        <Map
          viewDetails={handleViewDetails}
          setMapRef={mapRef}
          vehicles={vehicles || []}
          selectedVehicleId={selectedVehicleId}
          showRouting={showRouting}
          route={route}
        />
        <MapHeader showDetails={showDetails} />
        <PositionControls mapRef={mapRef} />
      </div>
    </div>
  );
}
