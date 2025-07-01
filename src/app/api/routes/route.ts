import { NextResponse } from "next/server"
import type { Route } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const driverId = searchParams.get("driverId")

  try {
    let url = `${API_BASE}/routes`
    const params = new URLSearchParams()

    if (status) params.append("status", status)
    if (driverId) params.append("driverId", driverId)

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const res = await fetch(url)

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch routes" }, { status: res.status })
    }

    const routes: Route[] = await res.json()
    return NextResponse.json(routes)
  } catch (error) {
    console.error("Error fetching routes:", error)
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 })
  }
}
