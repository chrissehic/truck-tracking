import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Route, Vehicle } from "@/types";
import { BatteryCharging, TruckElectric, X } from "lucide-react";
import { useRef } from "react";
import type { Popup as LeafletPopup } from "leaflet";

type VehicleMarkerProps = {
  vehicle: Vehicle;
  route: Route;
  viewDetails: (vehicle: Vehicle, route: Route) => void;
  icon: L.Icon | L.DivIcon;
};

export function VehicleMarker({
  vehicle,
  route,
  viewDetails,
  icon,
}: VehicleMarkerProps) {
  const map = useMap();
  const popupRef = useRef<LeafletPopup | null>(null);

  const hideElement = () => {
    if (!popupRef.current || !map) return;
    popupRef?.current?.close();
  };

  return (
    <Marker
      position={[vehicle.location.lat, vehicle.location.lng]}
      icon={icon}
      eventHandlers={{
        click: () => {
          map.flyTo([vehicle.location.lat, vehicle.location.lng], 17, {
            duration: 2,
          });
        },
      }}
    >
      <Popup
        className="text-white rounded-md shadow-lg"
        closeButton={false}
        ref={popupRef}
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-end items-center">
            <button
              className="cursor-pointer bg-transparent text-background"
              onClick={() => hideElement()}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-row flex justify-between items-center text-background">
            <TruckElectric className="size-5" />
            <span className="font-light text-sm">{vehicle.vehicleId}</span>
          </div>
          <span className="text-background">{vehicle.model}</span>
          <div className="flex flex-row items-center gap-1 text-lime-400">
            <span className="font-bold text-lg">{vehicle.battery.level}%</span>
            <BatteryCharging className="size-4" />
          </div>
          <button
            onClick={() => viewDetails(vehicle, route)}
            className="cursor-pointer w-full bg-lime-400 rounded-full hover:bg-lime-500 text-black font-medium text-sm py-1"
          >
            View details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
