// hooks/useVehicle.ts
import { useQuery } from "@tanstack/react-query";
import type { Vehicle } from "@/types";

export function useVehicle(vehicleId: string) {
  return useQuery<Vehicle>({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => {
      const res = await fetch(`/api/vehicles/${vehicleId}`);
      if (!res.ok) throw new Error("Failed to fetch vehicle");
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
}
