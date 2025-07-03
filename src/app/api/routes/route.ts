import { NextResponse } from 'next/server'
import type { Route } from '@/types/api'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') as 'active' | 'completed' | 'scheduled' | null
  const driverId = searchParams.get('driverId')

  if (!API_BASE) {
    return NextResponse.json(
      { error: 'API base URL is not configured' },
      { status: 500 }
    )
  }

  try {
    const url = new URL(`${API_BASE}/routes`)
    const params = new URLSearchParams()

    // Validate and add status parameter if provided
    if (status && ['active', 'completed', 'scheduled'].includes(status)) {
      params.append('status', status)
    }

    // Add driverId if provided
    if (driverId) {
      params.append('driverId', driverId)
    }

    // Add parameters to URL if any
    if (params.toString()) {
      url.search = params.toString()
    }

    const res = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch routes' },
        { status: res.status }
      )
    }

    const routes: Route[] = await res.json()

    // Validate the response matches our Route[] type
    if (!Array.isArray(routes) || (routes.length > 0 && !routes[0].routeId)) {
      throw new Error('Invalid routes data received from API')
    }

    return NextResponse.json(routes)
  } catch (error) {
    console.error('Error fetching routes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 }
    )
  }
}
