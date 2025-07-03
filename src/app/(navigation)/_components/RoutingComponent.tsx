"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import type { Route } from "@/types";
import { useRouteWaypoints } from "@/hooks/useRoute";

type RoutingComponentProps = {
  route: Route;
  showRouting: boolean;
  onGeocodingLoading: (loading: boolean) => void;
};

const RoutingComponent = ({
  route,
  showRouting,
  onGeocodingLoading,
}: RoutingComponentProps) => {
  const map = useMap();
  const controlRef = useRef<L.Routing.Control | null>(null);

  // Pre-fetch waypoints (happens immediately when route is available)
  const { data: waypoints = [], isLoading } = useRouteWaypoints(route);

  // Update loading state
  useEffect(() => {
    onGeocodingLoading(isLoading && showRouting);
  }, [isLoading, showRouting, onGeocodingLoading]);

  const cleanupRoutingControl = useCallback(() => {
    if (controlRef.current && map) {
      try {
        //@ts-expect-error off should be part of required types for Leaflet Routing
        controlRef.current.off();
        map.removeControl(controlRef.current);
        controlRef.current = null;
      } catch (error) {
        console.error("Error during routing control cleanup:", error);
      }
    }
  }, [map]);

  const addRoutingControl = useCallback(() => {
    if (!map || waypoints.length < 2 || controlRef.current) return;

    const startIcon = L.divIcon({
      html: "🚦",
      className: "emoji-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const endIcon = L.divIcon({
      html: "🏁",
      className: "emoji-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const control = L.Routing.control({
      waypoints: waypoints.map(([lat, lng]) => L.latLng(lat, lng)),
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: "black", weight: 6 }],
        extendToWaypoints: true,
        missingRouteTolerance: 1,
        addWaypoints: false,
      },
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      showAlternatives: false,
      show: false,
      //@ts-expect-error createmarker doesn't seem to be in the required types
      createMarker: (i, waypoint, n) => {
        if (i === 0) {
          return L.marker(waypoint.latLng, { icon: startIcon });
        } else if (i === n - 1) {
          return L.marker(waypoint.latLng, { icon: endIcon });
        }
        return null;
      },
    });

    control.addTo(map);
    controlRef.current = control;
  }, [map, waypoints]);

  // Control routing visibility
  useEffect(() => {
    if (showRouting && waypoints.length >= 2) {
      addRoutingControl();
    } else {
      cleanupRoutingControl();
    }
  }, [showRouting, addRoutingControl, cleanupRoutingControl, waypoints]);

  useEffect(() => {
    return () => {
      cleanupRoutingControl();
    };
  }, [cleanupRoutingControl]);

  return null;
};

export default RoutingComponent;
