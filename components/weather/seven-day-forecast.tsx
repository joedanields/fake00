"use client"

import useSWR from "swr"
import { useLocationCtx } from "../contexts/location-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import type { ForecastAIResponse } from "@/lib/types"
import { addDays, format } from "date-fns"

const postFetcher = async ([url, body]: [string, object]) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to fetch forecast")
  }
  return res.json()
}

function DayForecast({ date }: { date: Date }) {
  const { location } = useLocationCtx()
  const formattedDate = format(date, "yyyy-MM-dd")
  const { data, error, isLoading } = useSWR<ForecastAIResponse>(
    location ? [`/api/proxy/weather/forecast`, { location, date: formattedDate, time: "12:00" }] : null,
    postFetcher
  );

  if (isLoading) return <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 h-full justify-center"><Spinner /></div>
  if (error) return <div className="p-4 text-red-500 text-xs">{error.message}</div>
  if (!data) return null;

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-card/70 to-card/50 shadow-md border border-border/20 backdrop-blur-sm text-center h-full">
      <div className="font-bold text-lg text-foreground/90">{format(date, "EEE")}</div>
      <div className="text-4xl my-2">{mapConditionToEmoji(data.weather.condition.text)}</div>
      <div className="text-2xl font-bold text-foreground/95">{data.weather.temperature.current.toFixed(0)}°</div>
      <div className="text-xs text-muted-foreground/80 capitalize">{data.weather.condition.text}</div>
    </div>
  )
}

export function SevenDayForecast() {
  const { location } = useLocationCtx()
  const today = new Date();
  const nextFiveDays = Array.from({ length: 5 }).map((_, i) => addDays(today, i));

  return (
    <Card className="border-muted section-in h-full">
      <CardHeader>
        <CardTitle className="text-balance">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {!location && (
          <Alert>
            <AlertTitle>Enter a location</AlertTitle>
            <AlertDescription>See the 5-day forecast for your location.</AlertDescription>
          </Alert>
        )}
        {location && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {nextFiveDays.map(day => (
              <DayForecast key={day.toString()} date={day} />
            ))}
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
