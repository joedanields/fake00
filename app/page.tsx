"use client"

import { LocationProvider } from "@/components/contexts/location-context"
import { LocationSearch } from "@/components/location-search"
import { CurrentWeather } from "@/components/weather/current-weather"
import { SevenDayForecast } from "@/components/weather/seven-day-forecast";
import { HourlyForecastGraph } from "@/components/weather/hourly-forecast-graph";
import { WeatherBackground } from "@/components/weather/weather-background"
import { HealthIndicator } from "@/components/health-indicator"
import { WeatherThemeProvider, useWeatherTheme } from "@/components/contexts/weather-theme-context"

function PageInner() {
  const { theme } = useWeatherTheme()
  return (
    <div className={`min-h-dvh theme-${theme} transition-colors duration-500 relative`}>
      <WeatherBackground />

      <header className="border-b backdrop-blur-2xl bg-background/60 border-border/20 shadow-2xl relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between gap-4 animate-card-entrance">
            <div className="flex items-center gap-4">
              <div
                aria-hidden
                className="size-14 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-105 hover:shadow-3xl ring-2 ring-primary/20 hover:ring-primary/40"
                title="Logo"
              >
                🌤️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text leading-tight">
                  Will It Rain On My Parade?
                </h1>
                <p className="text-sm text-muted-foreground/80 font-medium tracking-wide">Smart, fast weather decisions</p>
              </div>
            </div>
            <HealthIndicator />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 relative z-10">
        <div className="space-y-8">
          <div className="animate-card-entrance" style={{ animationDelay: '0.1s' }}>
            <LocationSearch />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 animate-card-entrance" style={{ animationDelay: '0.2s' }}>
              <CurrentWeather />
            </div>
            <div className="lg:col-span-2 animate-card-entrance" style={{ animationDelay: '0.3s' }}>
              <SevenDayForecast />
            </div>
            <div className="lg:col-span-3 animate-card-entrance" style={{ animationDelay: '0.4s' }}>
              <HourlyForecastGraph />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t backdrop-blur-xl bg-background/60 border-border/20 py-12 mt-16 relative z-10">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-muted-foreground/80 mb-2">
            Built with <span className="text-primary font-semibold animate-text-shimmer bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Next.js</span> and{" "}
            <span className="text-primary font-semibold animate-text-shimmer bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">shadcn/ui</span>
          </p>
          <p className="text-xs text-muted-foreground/60">Backend: Flask on Render</p>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <LocationProvider>
      <WeatherThemeProvider>
        <PageInner />
      </WeatherThemeProvider>
    </LocationProvider>
  )
}
