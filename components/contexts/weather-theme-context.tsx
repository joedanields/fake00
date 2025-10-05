"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type WeatherThemeKey = "base" | "sunny" | "cloudy" | "rainy" | "stormy" | "snow" | "fog" | "windy" | "night"

type WeatherThemeContextValue = {
  theme: WeatherThemeKey
  setTheme: (t: WeatherThemeKey) => void
  setThemeByCondition: (conditionText: string) => void
}

const WeatherThemeContext = createContext<WeatherThemeContextValue | undefined>(undefined)

function normalizeCondition(condition: string) {
  const c = condition.toLowerCase()
  if (c.includes("thunder") || c.includes("storm")) return "stormy"
  if (c.includes("rain") || c.includes("shower") || c.includes("drizzle")) return "rainy"
  if (c.includes("snow") || c.includes("sleet") || c.includes("blizzard")) return "snow"
  if (c.includes("fog") || c.includes("mist") || c.includes("haze")) return "fog"
  if (c.includes("wind")) return "windy"
  if (c.includes("cloud")) return "cloudy"
  if (c.includes("clear") || c.includes("sun")) return "sunny"
  if (c.includes("night")) return "night"
  return "base"
}

export function WeatherThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<WeatherThemeKey>("base")

  // Keep the body class in sync so global CSS can style per theme (e.g. .theme-sunny)
  // This is a UI-side only effect and does not touch backend logic or APIs.
  ;(function useBodyClassSync() {
    // lightweight hook emulation to avoid importing useEffect here (used in client components)
    // We'll update the body class synchronously when setTheme is called by wrapping setTheme.
  })()

  // wrapped setter that also updates document.body class when available
  function applyTheme(t: WeatherThemeKey) {
    setTheme(t)
    try {
      if (typeof document !== "undefined") {
        // remove previous theme-* classes
        Array.from(document.body.classList)
          .filter((c) => c.startsWith("theme-"))
          .forEach((c) => document.body.classList.remove(c))
        document.body.classList.add(`theme-${t}`)
      }
    } catch (e) {
      // noop in SSR or restricted environments
    }
  }

  const value = useMemo<WeatherThemeContextValue>(
    () => ({
      theme,
      setTheme: applyTheme,
      setThemeByCondition: (conditionText: string) => applyTheme(normalizeCondition(conditionText || "")),
    }),
    [theme],
  )

  return <WeatherThemeContext.Provider value={value}>{children}</WeatherThemeContext.Provider>
}

export function useWeatherTheme() {
  const ctx = useContext(WeatherThemeContext)
  if (!ctx) throw new Error("useWeatherTheme must be used within WeatherThemeProvider")
  return ctx
}
