// hooks/useRoute.ts
import { useQuery } from "@tanstack/react-query";
import type { Route } from "@/types";
import { getLatLngNominatim } from "@/lib/helpers/getCoords";

export function useRoute(vehicleId?: string) {
  return useQuery<Route>({
    queryKey: ["route", vehicleId],
    queryFn: async () => {
      if (!vehicleId) throw new Error("No vehicle selected");
      const res = await fetch(`/api/vehicles/${vehicleId}/route-details`);
      if (!res.ok) throw new Error("Failed to fetch route");
      return res.json();
    },
    refetchOnWindowFocus: false,
    enabled: !!vehicleId,
  });
}


// Pre-geocode all addresses from a route
export function useRouteWaypoints(route?: Route) {
  return useQuery<[number, number][]>({
    queryKey: ["waypoints", route?.routeId],
    queryFn: async () => {
      if (!route?.stops?.length) return []

      const coordinates = await Promise.all(
        route.stops.map(async (stop) => {
          if (!stop.address) return null
          try {
            const { lat, lng } = await getLatLngNominatim(stop.address)
            return [lat, lng] as [number, number]
          } catch (error) {
            console.warn(`Failed to geocode: ${stop.address}`, error)
            return null
          }
        }),
      )

      return coordinates.filter(Boolean) as [number, number][]
    },
    enabled: !!route?.stops?.length,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}
