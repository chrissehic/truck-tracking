import { NextResponse } from 'next/server'
import type { LocationUpdate } from '@/types/api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(
  request: Request,
  { params }: { params: { vehicleId: string } }
) {
  const { vehicleId } = await params

  if (!API_BASE) {
    return NextResponse.json(
      { error: 'API base URL is not configured' },
      { status: 500 }
    )
  }

  const apiUrl = `${API_BASE}/vehicles/${encodeURIComponent(vehicleId)}/location`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Disable caching for real-time data
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Location for vehicle ${vehicleId} not found` },
        { status: res.status }
      )
    }

    const locationData: LocationUpdate = await res.json()

    // Validate the response matches our LocationUpdate type
    if (!locationData.vehicleId || !locationData.location || locationData.speed === undefined) {
      throw new Error('Invalid location data received from API')
    }

    return NextResponse.json(locationData)
  } catch (error) {
    console.error('Error fetching vehicle location:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle location' },
      { status: 500 }
    )
  }
}
