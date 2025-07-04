import { NextResponse } from 'next/server'
import type { Route } from '@/types/api'

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

  const apiUrl = `${API_BASE}/vehicles/${encodeURIComponent(vehicleId)}/route`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Disable caching for real-time data
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Route for vehicle ${vehicleId} not found` },
        { status: res.status }
      )
    }

    const routeData: Route = await res.json()

    // Validate the response matches our Route type
    if (!routeData.routeId || !routeData.vehicleId || !routeData.stops) {
      throw new Error('Invalid route data received from API')
    }

    return NextResponse.json(routeData)
  } catch (error) {
    console.error('Error fetching vehicle route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle route' },
      { status: 500 }
    )
  }
}
