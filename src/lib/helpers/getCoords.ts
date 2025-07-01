// Simple in-memory cache for addresses to coordinates
const addressCache = new Map<string, { lat: number; lng: number }>();

export async function getLatLngNominatim(address: string): Promise<{ lat: number; lng: number }> {
  if (addressCache.has(address)) {
    // Return cached coords if available
    return addressCache.get(address)!;
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Truck-Tracking/1.0 (christopher.sehic@gmail.com)',
      'Accept-Language': 'en',
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching geocoding data: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error(`No results found for address: ${address}`);
  }

  const location = data[0];
  const coords = {
    lat: parseFloat(location.lat),
    lng: parseFloat(location.lon),
  };

  // Cache the result
  addressCache.set(address, coords);

  return coords;
}

// export async function enrichStopsWithCoords(stops: Stop[]): Promise<Stop[]> {
//   // Map over stops and fetch lat/lng, but only if not cached yet
//   const enrichedStops = await Promise.all(
//     stops.map(async (stop) => {
//       try {
//         const coords = await getLatLngNominatim(stop.address);
//         return { ...stop, lat: coords.lat, lng: coords.lng };
//       } catch (error) {
//         console.error(error);
//         // Return stop without lat/lng if geocoding fails
//         return stop;
//       }
//     })
//   );
//   return enrichedStops;
// }
