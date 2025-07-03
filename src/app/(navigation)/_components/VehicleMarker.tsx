"use client";

import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Vehicle } from "@/types";
import { BatteryCharging, TruckElectric, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { Popup as LeafletPopup } from "leaflet";
import { renderToString } from "react-dom/server";

type VehicleMarkerProps = {
  vehicle: Vehicle;
  viewDetails: () => void;
  icon: L.Icon | L.DivIcon; // This will be the black circle icon
};

export function VehicleMarker({
  vehicle,
  viewDetails,
  icon,
}: VehicleMarkerProps) {
  const map = useMap();
  const popupRef = useRef<LeafletPopup | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Create truck icon using Lucide icon
  const createTruckIcon = () => {
    const truckIconSvg = renderToString(
      <TruckElectric
        size={20}
        color="var(--marker-foreground)"
      />
    );

    return L.divIcon({
      className: "custom-truck-marker",
      html: `
    <div style="position: relative; width: 50px; height: 55px;">
      <div style="
        width: 50px; 
        height: 50px; 
        background: var(--marker-background);
        border-radius: 15%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      ">
        ${truckIconSvg}
      </div>
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 12px;
        height: 12px;
        background: black;
      "></div>
    </div>
  `,
      iconSize: [50, 62], // full marker dimensions: 50 wide x 62 tall
      iconAnchor: [25, 62], // anchor point at bottom-center (tip)
    });
  };

  const truckIcon = createTruckIcon();

  // Update marker icon based on popup state
  useEffect(() => {
    if (markerRef.current) {
      const newIcon = isPopupOpen ? icon : truckIcon;
      markerRef.current.setIcon(newIcon);
    }
  }, [isPopupOpen, icon, truckIcon]);

  const hideElement = () => {
    if (!popupRef.current || !map) return;
    popupRef?.current?.close();
  };

  return (
    <Marker
      position={[vehicle.location.lat, vehicle.location.lng]}
      icon={truckIcon} // Start with truck icon
      ref={markerRef}
      eventHandlers={{
        click: () => {
          map.flyTo([vehicle.location.lat, vehicle.location.lng], 17, {
            duration: 2,
            animate: false
          });
        },
        popupopen: () => {
          setIsPopupOpen(true);
        },
        popupclose: () => {
          setIsPopupOpen(false);
        },
      }}
    >
      <Popup
        className="rounded-md shadow-lg"
        closeButton={false}
        ref={popupRef}
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-end items-center">
            <button
              className="cursor-pointer bg-transparent text-marker-foreground"
              onClick={() => hideElement()}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-row flex justify-between items-center text-marker-foreground">
            <TruckElectric className="size-5" />
            <span className="font-light text-sm">{vehicle.vehicleId}</span>
          </div>
          <span className="text-marker-foreground">{vehicle.model}</span>
          <div className="flex flex-row items-center gap-1 text-secondary">
            <span className="font-bold text-lg">{vehicle.battery.level}%</span>
            <BatteryCharging className="size-4" />
          </div>
          <button
            onClick={() => viewDetails()}
            className="cursor-pointer w-full bg-secondary rounded-full hover:bg-secondary/80 text-marker-background font-medium text-sm py-1"
          >
            View details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
