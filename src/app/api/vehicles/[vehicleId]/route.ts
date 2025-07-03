import { NextResponse } from 'next/server'
import type { Vehicle } from '@/types/api'

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

  const apiUrl = `${API_BASE}/vehicles/${encodeURIComponent(vehicleId)}`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Disable caching
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Vehicle with ID ${vehicleId} not found` },
        { status: 404 }
      )
    }

    const vehicleData: Vehicle = await res.json()

    // Validate the response matches our Vehicle type
    if (!vehicleData.vehicleId || !vehicleData.model || !vehicleData.driver) {
      throw new Error('Invalid vehicle data received from API')
    }

    return NextResponse.json(vehicleData)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle details' },
      { status: 500 }
    )
  }
}
