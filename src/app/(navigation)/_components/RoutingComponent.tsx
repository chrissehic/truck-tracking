"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet-routing-machine"
import type { Route } from "@/types"
import { getLatLngNominatim } from "@/lib/helpers/getCoords"

type RoutingComponentProps = {
  route: Route
  showRouting: boolean // New prop to control visibility
}

const RoutingComponent = ({ route, showRouting }: RoutingComponentProps) => {
  const map = useMap()
  const controlRef = useRef<L.Routing.Control | null>(null)
  const [waypoints, setWaypoints] = useState<[number, number][]>([])
  const [isGeocoding, setIsGeocoding] = useState(true)

  // Cleanup function
  const cleanupRoutingControl = useCallback(() => {
    if (controlRef.current && map) {
      try {
        // Remove event listeners
        // @ts-expect-error - This is a workaround to hide the container
        controlRef.current.off()
        // Remove control from map
        map.removeControl(controlRef.current)
        // Clear the reference
        controlRef.current = null
      } catch (error) {
        console.error("Error during routing control cleanup:", error)
      }
    }
  }, [map])

  // Add routing control to map
  const addRoutingControl = useCallback(() => {
    if (!map || isGeocoding || waypoints.length < 2 || controlRef.current) return

    const startIcon = L.divIcon({
      html: "🚦",
      className: "emoji-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })

    const endIcon = L.divIcon({
      html: "🏁",
      className: "emoji-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })

    console.log("Adding routing control with waypoints:", waypoints)

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
      // @ts-expect-error - This is a workaround to hide the container
      createMarker: (i, waypoint, n) => {
        if (i === 0) {
          return L.marker(waypoint.latLng, { icon: startIcon })
        } else if (i === n - 1) {
          return L.marker(waypoint.latLng, { icon: endIcon })
        }
        return null
      },
    })

    control.addTo(map)
    controlRef.current = control
  }, [map, waypoints, isGeocoding])

  // Geocode stops when route changes
  useEffect(() => {
    const geocodeStops = async () => {
      if (!route?.stops?.length) return

      setIsGeocoding(true)
      try {
        const coordinates = await Promise.all(
          route.stops.map(async (stop) => {
            if (stop.address) {
              const { lat, lng } = await getLatLngNominatim(stop.address)
              return [lat, lng]
            }
            return null
          }),
        )

        setWaypoints(coordinates.filter(Boolean) as [number, number][])
      } catch (error) {
        console.error("Error during geocoding:", error)
      }
      setIsGeocoding(false)
    }

    geocodeStops()
  }, [route])

  // Control routing visibility based on showRouting prop
  useEffect(() => {
    if (showRouting && !isGeocoding && waypoints.length >= 2) {
      addRoutingControl()
    } else {
      cleanupRoutingControl()
    }
  }, [showRouting, addRoutingControl, cleanupRoutingControl, isGeocoding, waypoints])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRoutingControl()
    }
  }, [cleanupRoutingControl])

  return null
}

export default RoutingComponent
