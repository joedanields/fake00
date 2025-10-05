"use client"

import type React from "react"

import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { useLocationCtx } from "../contexts/location-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import type { RecommendationsResponse } from "@/lib/types"

type Payload = { location: string; date: string; time: string }

async function postJSON(url: string, { arg }: { arg: Payload }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to fetch recommendations")
  }
  return (await res.json()) as RecommendationsResponse
}

function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, "0")
  const day = d.getDate().toString().padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function Recommendations() {
  const { location } = useLocationCtx()
  const [date, setDate] = useState<string>(formatDate(new Date()))
  const [time, setTime] = useState<string>("14:00")

  const { trigger, data, error, isMutating, reset } = useSWRMutation("/api/proxy/weather/recommendations", postJSON)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!location) return
    reset()
    await trigger({ location, date, time })
  }

  const items =
    data?.recommendations
      ?.split("\n")
      .map((s) => s.replace(/^-+\s*/, ""))
      .filter(Boolean) || []

  return (
    <Card className="border-muted section-in">
      <CardHeader>
        <CardTitle className="text-balance">Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!location && (
          <Alert>
            <AlertTitle>Enter a location</AlertTitle>
            <AlertDescription>Set a location above to get tailored recommendations.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3 md:items-end">
          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="date2">
              Date
            </label>
            <Input id="date2" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="time2">
              Time
            </label>
            <Input id="time2" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>

          <Button type="submit" disabled={!location || isMutating} className="transition-transform active:scale-[0.98]">
            {isMutating ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4" />
                Getting recommendations...
              </span>
            ) : (
              "Get Recommendations"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Recommendations error</AlertTitle>
            <AlertDescription className="text-pretty">{error.message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-xl p-6 shadow-lg border border-primary/20 hover:border-primary/30 animate-card-entrance">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg">💡</span>
              </div>
              <div className="text-sm font-semibold text-primary tracking-wide">
                For {data.location} on {data.date} at {data.time}
              </div>
            </div>
            <ul className="space-y-3">
              {items.map((it, idx) => (
                <li 
                  key={idx} 
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-200 animate-card-entrance border border-border/20 hover:border-border/40"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <span className="text-primary font-bold text-lg mt-0.5">•</span>
                  <span className="flex-1 text-foreground/80 leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
