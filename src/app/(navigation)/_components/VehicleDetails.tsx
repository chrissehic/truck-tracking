"use client";

import { VEHICLE_DETAILS_WIDTH } from "@/lib/constants";
import { cn, formatHoursMinutes, stopTypeVariants } from "@/lib/utils";
import type { Route, Vehicle } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { MenuSeparator } from "@headlessui/react";
import {
  BatteryCharging,
  Circle,
  ContactRound,
  Loader2,
  Navigation,
  TruckElectric,
  X,
} from "lucide-react";

type VehicleDetailsProps = {
  vehicle: Vehicle | undefined;
  route: Route | undefined;
  onClose?: () => void;
  isOpen: boolean;
  vehicleId: string | null;
};

const CardClass =
  "flex justify-start items-center bg-lime-600/10 p-6 rounded-xl gap-3";

export default function VehicleDetails({
  vehicle: initialVehicle,
  route,
  isOpen,
  onClose,
  vehicleId,
}: VehicleDetailsProps) {
  const { data: vehicle } = useQuery<Vehicle>({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => {
      if (!vehicleId) throw new Error("No vehicle ID provided");
      const res = await fetch(`/api/vehicles/${vehicleId}`);
      if (!res.ok) throw new Error("Failed to fetch vehicle");
      return res.json();
    },
    initialData: initialVehicle,
    enabled: !!vehicleId && isOpen,
  });

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div
      className={cn(
        `fixed h-full flex flex-col bg-background shadow-2xl z-20 transition-transform duration-300 ease-in-out overflow-hidden w-[${VEHICLE_DETAILS_WIDTH}]`,
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-full w-full flex flex-col overflow-hidden">
        <header className="flex-shrink-0 p-6 pb-0">
          <div className="flex flex-row items-center justify-end">
            <button
              onClick={handleClose}
              className="cursor-pointer size-12 hover:bg-accent flex justify-center items-center rounded-md"
            >
              <X className="size-8 text-foreground" />
            </button>
          </div>
        </header>

        {vehicle ? (
          <div className="flex-1 flex flex-col gap-5 justify-start overflow-auto p-6 pt-5">
            <div className="w-fit bg-lime-400 dark:bg-lime-600 rounded-full px-5 font-medium py-2">
              Real time track
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex-row flex gap-3 items-center">
                <TruckElectric className="size-10" />
                <span className="text-foreground font-bold text-4xl">
                  {vehicle.vehicleId}
                </span>
              </div>
              <div className="flex flex-row justify-between items-center gap-2 text-muted-foreground">
                <span>{vehicle.model}</span>
                <span className="flex flex-row gap-1 items-center">
                  <ContactRound className="size-4" />
                  {vehicle.driver.name}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div className={cn("flex-2", CardClass)}>
                <BatteryCharging className="size-8" />
                <div className="flex flex-col">
                  <span className="font-bold text-3xl">
                    {vehicle.battery.level}%
                  </span>
                  <span>Battery</span>
                </div>
              </div>

              <div className={cn("flex-3", CardClass)}>
                <Navigation className="size-8" />

                <div className="flex flex-col">
                  <span className="font-bold text-3xl">
                    {vehicle.speed}km/h
                  </span>
                  <span className="text-lg">Speed</span>
                </div>
              </div>
            </div>
            <MenuSeparator className="my-1 h-px bg-accent" />
            <div className="flex flex-col gap-4">
              <h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
                Truck Route
              </h3>
              <div>
                {route?.stops.map((stop, index) => (
                  <div className="flex flex-row gap-3" key={index}>
                    <div className="flex flex-col justify-center items-center relative">
                      <div
                        className={cn(
                          "w-0.5 h-full",
                          index > 0 && route.stops.length > 1
                            ? "bg-ring/70"
                            : "bg-transparent"
                        )}
                      ></div>
                      <Circle
                        className={cn(
                          "size-6 text-transparent bg-transparent z-20",
                          route.currentStopIndex === index
                            ? "fill-lime-400"
                            : "fill-ring",
                          "size-4 shrink-0"
                        )}
                      ></Circle>
                      <Circle
                        className={cn(
                          "absolute size-7 bg-transparent text-transparent z-10",
                          route.currentStopIndex === index
                            ? "fill-lime-400/20 animate-ping"
                            : "fill-ring/20"
                        )}
                      ></Circle>
                      <Circle
                        className={cn(
                          "absolute size-7 bg-transparent text-transparent z-10",
                          route.currentStopIndex === index
                            ? "fill-lime-400/20"
                            : "fill-ring/20"
                        )}
                      ></Circle>
                      <div
                        className={cn(
                          "w-0.5 h-full",
                          index < route.stops.length - 1 &&
                            route.stops.length > 1
                            ? "bg-ring/70"
                            : "bg-transparent"
                        )}
                      ></div>
                    </div>
                    <div className="flex flex-col flex-1 py-2">
                      <span className="text-muted-foreground">
                        {stop.address}
                      </span>
                      <span className="font-semibold">
                        {stopTypeVariants[stop.type]}
                      </span>
                    </div>
                    <div className="flex flex-col justify-end items-end py-2">
                      <span className="text-sm">
                        {formatHoursMinutes(stop.duration)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
