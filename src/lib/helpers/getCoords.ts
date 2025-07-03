// Simple in-memory cache for addresses to coordinates
const addressCache = new Map<string, { lat: number; lng: number }>();

export async function getLatLngNominatim(address: string): Promise<{ lat: number; lng: number }> {
  if (addressCache.has(address)) {
    // Return cached coords if available
    return addressCache.get(address)!;
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=5`;

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
