import { StopType } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Mapping StopType to formatted strings
export const stopTypeVariants: Record<StopType, string> = {
  departure: "Departure",
  break: "Break",
  charging_station: "Charging Station",
  destination: "Destination",
};

export function formatHoursMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
}