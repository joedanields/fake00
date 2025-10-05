"use client"

import useSWR from "swr"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export function HealthIndicator() {
  const { data, isLoading } = useSWR("/api/proxy/health", fetcher)

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <Spinner className="size-3" /> Checking API...
      </span>
    )
  }

  const ok = !!data
  return (
    <Badge
      variant={ok ? "default" : "destructive"}
      aria-live="polite"
      aria-label={ok ? "Backend healthy" : "Backend unreachable"}
    >
      {ok ? "API: Healthy" : "API: Unavailable"}
    </Badge>
  )
}
