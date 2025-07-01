import { NextResponse } from 'next/server'

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

  const apiUrl = `${API_BASE}/vehicles/${vehicleId}`

  try {
    const res = await fetch(apiUrl)

    if (!res.ok) {
      return NextResponse.json(
        { error: `Vehicle with ID ${vehicleId} not found` },
        { status: 404 }
      )
    }

    const vehicleData = await res.json()

    return NextResponse.json(vehicleData)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle details' },
      { status: 500 }
    )
  }
}
