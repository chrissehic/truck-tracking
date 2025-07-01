import { NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(
  request: Request,
  { params }: { params: { vehicleId: string } }
) {
  const { vehicleId } = await params

  const res = await fetch(`${API_BASE}/vehicles/${vehicleId}/route`)

  if (!res.ok) {
    return NextResponse.json({ error: `Route for vehicle ${vehicleId} not found` }, { status: res.status })
  }

  const route = await res.json()
  return NextResponse.json(route)
}
