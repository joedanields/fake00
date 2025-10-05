"use client"

import type React from "react"
import { useEffect } from "react"
import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { useLocationCtx } from "../contexts/location-context"
import { useWeatherTheme } from "@/components/contexts/weather-theme-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import type { ForecastAIResponse } from "@/lib/types"

type Payload = { location: string; date: string; time: string }

async function postJSON(url: string, { arg }: { arg: Payload }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to fetch forecast")
  }
  return (await res.json()) as ForecastAIResponse
}

function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, "0")
  const day = d.getDate().toString().padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function Forecast() {
  const { location } = useLocationCtx()
  const [date, setDate] = useState<string>(formatDate(new Date()))
  const [time, setTime] = useState<string>("14:00")
  const { setThemeByCondition } = useWeatherTheme()

  const { trigger, data, error, isMutating, reset } = useSWRMutation("/api/proxy/weather/forecast", postJSON)

  useEffect(() => {
    if (data?.weather?.condition?.text) {
      setThemeByCondition(String(data.weather.condition.text))
    }
  }, [data?.weather?.condition?.text, setThemeByCondition])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!location) return
    reset()
    await trigger({ location, date, time })
  }

  return (
    <Card className="border-muted section-in">
      <CardHeader>
        <CardTitle className="text-balance">Forecast & AI Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!location && (
          <Alert>
            <AlertTitle>Enter a location</AlertTitle>
            <AlertDescription>Set a location above to request an AI-powered forecast.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3 md:items-end">
          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="date">
              Date
            </label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground" htmlFor="time">
              Time
            </label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>

          <Button type="submit" disabled={!location || isMutating} className="transition-transform active:scale-[0.98]">
            {isMutating ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="size-4" />
                Getting forecast...
              </span>
            ) : (
              "Get Forecast"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Forecast error</AlertTitle>
            <AlertDescription className="text-pretty">{error.message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="col-span-1 md:col-span-1 lg:col-span-1 rounded-2xl p-4 bg-gradient-to-br from-card/85 to-card/65 border border-border/30 shadow-md">
              <div className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-2 font-semibold">When</div>
              <div className="text-lg font-bold">{data.date} • {data.time}</div>
              <div className="text-sm text-muted-foreground/60 mt-2">Location: {data.location.name}</div>
            </div>

            <div className="col-span-2 md:col-span-2 lg:col-span-2 rounded-2xl p-4 bg-gradient-to-br from-card/85 to-card/65 border border-border/30 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center text-4xl">{mapConditionToEmoji(data.weather.condition.text)}</div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground/70 mb-1 font-semibold">Condition</div>
                  <div className="text-2xl font-bold">{data.weather.condition.text}</div>
                  <div className="text-sm text-muted-foreground/60 mt-1">Humidity: {data.weather.humidity}%</div>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-1 rounded-2xl p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-md">
              <div className="text-xs uppercase tracking-wide text-primary font-bold mb-2">Temperature</div>
              <div className="text-3xl font-extrabold">{data.weather.temperature.current.toFixed(1)}°C</div>
              <div className="text-sm text-muted-foreground/60 mt-1">Feels like {data.weather.temperature.feels_like.toFixed(1)}°C</div>
            </div>

            <div className="col-span-4 rounded-2xl p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">🤖</div>
                <div className="text-sm font-semibold text-primary">AI-Powered Analysis</div>
              </div>
              <p className="text-pretty leading-relaxed text-foreground/80">{data.ai_analysis}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function mapConditionToEmoji(condition: string) {
  const c = (condition || "").toLowerCase()
  if (c.includes("thunder") || c.includes("storm")) return '⛈️'
  if (c.includes("rain") || c.includes("shower") || c.includes("drizzle")) return '🌧️'
  if (c.includes("snow") || c.includes("sleet") || c.includes("blizzard")) return '❄️'
  if (c.includes("fog") || c.includes("mist") || c.includes("haze")) return '🌫️'
  if (c.includes("cloud")) return '☁️'
  if (c.includes("clear") || c.includes("sun")) return '🌤️'
  if (c.includes("night")) return '🌙'
  return '🌈'
}
