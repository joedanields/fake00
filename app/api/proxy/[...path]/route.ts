import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "https://will-it-rain-on-my-parade-e1yj.onrender.com"

function joinUrl(base: string, path: string, search: string) {
  const trimmedBase = base.replace(/\/+$/, "")
  const trimmedPath = path.replace(/^\/+/, "")
  return `${trimmedBase}/${trimmedPath}${search || ""}`
}

async function forward(request: Request, params: { path: string[] }) {
  const { path } = params
  const incomingUrl = new URL(request.url)
  const targetUrl = joinUrl(BACKEND_URL, path.join("/"), incomingUrl.search)

  const init: RequestInit = {
    method: request.method,
    // Avoid passing hop-by-hop headers; set minimal headers
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json",
    },
    // For GET, body must be undefined
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    // Do not cache API responses
    cache: "no-store",
  }

  try {
    const res = await fetch(targetUrl, init)
    const contentType = res.headers.get("content-type") || ""
    const body = await res.text()

    // Mirror status and content-type to client
    return new NextResponse(body, {
      status: res.status,
      headers: { "content-type": contentType },
    })
  } catch (err: any) {
    return NextResponse.json({ error: "Proxy error", message: err?.message || "Unknown error" }, { status: 502 })
  }
}

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  return forward(request, params)
}

export async function POST(request: Request, { params }: { params: { path: string[] } }) {
  return forward(request, params)
}

export async function OPTIONS() {
  // Basic CORS preflight support (allow from anywhere by default)
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
