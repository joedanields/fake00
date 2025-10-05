"use client"

import useSWR from "swr"
import { useLocationCtx } from "../contexts/location-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import type { CurrentWeatherResponse } from "@/lib/types"
import { useEffect } from "react"
import { useWeatherTheme } from "@/components/contexts/weather-theme-context"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to fetch current weather")
  }
  return res.json()
}

export function CurrentWeather() {
  const { location } = useLocationCtx()
  const { setThemeByCondition } = useWeatherTheme()

  const { data, error, isLoading } = useSWR<CurrentWeatherResponse>(
    location ? `/api/proxy/weather/current?location=${encodeURIComponent(location)}` : null,
    fetcher,
  )

  useEffect(() => {
    if (data?.current?.condition) {
      setThemeByCondition(String(data.current.condition))
    }
  }, [data?.current?.condition, setThemeByCondition])

  return (
    <Card className="border-muted section-in">
      <CardHeader>
        <CardTitle className="text-balance">Current Weather</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!location && (
          <Alert>
            <AlertTitle>Enter a location</AlertTitle>
            <AlertDescription>Use the field above to set your location to see live conditions.</AlertDescription>
          </Alert>
        )}

        {isLoading && location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner className="size-5" />
            <span>Loading current weather...</span>
          </div>
        )}

        {error && location && (
          <Alert variant="destructive">
            <AlertTitle>Could not load current weather</AlertTitle>
            <AlertDescription className="text-pretty">{error.message}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="grid gap-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card/90 to-card/70 p-6 shadow-2xl border border-border/30 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-36 h-36 rounded-full flex items-center justify-center shadow-inner flex-shrink-0" style={{ background: 'linear-gradient(180deg,var(--color-primary), rgba(255,255,255,0.06))' }}>
                  <WeatherIcon condition={data.current.condition} size={96} />
                </div>

                <div className="flex-1">
                  <div className="text-sm uppercase tracking-wide text-muted-foreground mb-1 font-semibold">{data.location.name}</div>
                  <div className="text-6xl font-extrabold leading-tight text-foreground/95">{data.current.temperature_c.toFixed(0)}°C</div>
                  <div className="text-xl text-muted-foreground/80 mt-1">{data.current.condition}</div>

                  {data.location.localtime && (
                    <div className="mt-3 text-sm text-muted-foreground/60 flex items-center gap-2 justify-center sm:justify-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span>Local time: {data.location.localtime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard title="Humidity">
                <div className="text-4xl font-bold text-foreground/90">{data.current.humidity}%</div>
                <div className="text-sm text-muted-foreground/70 mt-1">Comfort index</div>
              </StatCard>

              <StatCard title="Wind">
                <div className="text-4xl font-bold text-foreground/90">{data.current.wind_kph.toFixed(1)} kph</div>
                <div className="text-sm text-muted-foreground/70 mt-1">Wind speed</div>
              </StatCard>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatCard({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 rounded-3xl bg-gradient-to-br from-card/80 to-card/60 shadow-lg border border-border/20 backdrop-blur-sm ${className}`}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  )
}

function WeatherIcon({ condition, size }: { condition: string, size: number }) {
  const iconMap: Record<string, string> = {
    "Sunny": "☀️",
    "Clear": "🌙",
    "Partly cloudy": "⛅️",
    "Cloudy": "☁️",
    "Overcast": "🌥️",
    "Mist": "🌫️",
    "Patchy rain possible": "🌦️",
    "Patchy snow possible": "🌨️",
    "Patchy sleet possible": "🌨️",
    "Patchy freezing drizzle possible": "🥶",
    "Thundery outbreaks possible": "⛈️",
    "Blowing snow": "🌬️",
    "Blizzard": "❄️",
    "Fog": "🌫️",
    "Freezing fog": "🥶",
    "Patchy light drizzle": "💧",
    "Light drizzle": "💧",
    "Freezing drizzle": "🥶",
    "Heavy freezing drizzle": "🥶",
    "Patchy light rain": "🌦️",
    "Light rain": "🌧️",
    "Moderate rain at times": "🌧️",
    "Moderate rain": "🌧️",
    "Heavy rain at times": "🌧️",
    "Heavy rain": "🌧️",
    "Light freezing rain": "🥶",
    "Moderate or heavy freezing rain": "🥶",
    "Light sleet": "🌨️",
    "Moderate or heavy sleet": "🌨️",
    "Patchy light snow": "🌨️",
    "Light snow": "🌨️",
    "Patchy moderate snow": "🌨️",
    "Moderate snow": "🌨️",
    "Patchy heavy snow": "🌨️",
    "Heavy snow": "🌨️",
    "Ice pellets": "🥶",
    "Light rain shower": "🌦️",
    "Moderate or heavy rain shower": "🌧️",
    "Torrential rain shower": "🌧️",
    "Light sleet showers": "🌨️",
    "Moderate or heavy sleet showers": "🌨️",
    "Light snow showers": "🌨️",
    "Moderate or heavy snow showers": "🌨️",
    "Light showers of ice pellets": "🥶",
    "Moderate or heavy showers of ice pellets": "🥶",
    "Patchy light rain with thunder": "⛈️",
    "Moderate or heavy rain with thunder": "⛈️",
    "Patchy light snow with thunder": "⛈️",
    "Moderate or heavy snow with thunder": "⛈️",
  }
  const icon = iconMap[condition] || "🤔"

  return (
    <div className="text-center" style={{ fontSize: `${size}px` }}>
      {icon}
    </div>
  )
}
