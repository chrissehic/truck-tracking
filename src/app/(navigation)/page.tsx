"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VehicleDetails from "./_components/VehicleDetails";
import MapHeader from "./_components/MapHeader";
import PositionControls from "./_components/PositionControls";
import { Loader2 } from "lucide-react";
import type L from "leaflet";
import { useRoute } from "@/hooks/useRoute";
import { useVehicle } from "@/hooks/useVehicle";
import LoadingBar from "./_components/LoadingBar";

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
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);

  const mockVehicleId = "FRS850";

  const {
    data: vehicle,
    isLoading: vehicleLoading,
    error: vehicleError,
  } = useVehicle(mockVehicleId);

  const vehicles = vehicle ? [vehicle] : [];
  const selectedVehicle =
    selectedVehicleId === mockVehicleId ? vehicle : undefined;

  const {
    data: route,
    isLoading: routeLoading,
    error: routeError,
  } = useRoute(selectedVehicleId || undefined);

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
      <LoadingBar isLoading={isGeocodingLoading} />
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
          setIsGeocodingLoading={setIsGeocodingLoading}
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
