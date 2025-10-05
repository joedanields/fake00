"use client"

import { useWeatherTheme } from "@/components/contexts/weather-theme-context"
import { useEffect, useState } from "react"

export function WeatherBackground() {
  const { theme } = useWeatherTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden>
      {/* subtle theme-tinted overlay to reinforce the current theme color */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{ background: 'linear-gradient(180deg, var(--color-primary) 0%, transparent 60%)', opacity: 0.06 }}
      />
      {/* Sun */}
      {theme === "sunny" && (
        <>
          <div className="sun absolute top-20 right-20 w-32 h-32 rounded-full bg-yellow-300 animate-pulse-slow shadow-[0_0_60px_30px_rgba(253,224,71,0.4)]" />
          <div className="sun-rays absolute top-20 right-20 w-32 h-32">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-20 bg-yellow-200/40 origin-top animate-rotate-ray"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Clouds */}
      {(theme === "cloudy" || theme === "rainy" || theme === "stormy") && (
        <div className="clouds-container">
          <div className="cloud cloud-1 absolute top-10 left-[10%] animate-float-cloud">
            <CloudSVG opacity={theme === "stormy" ? 0.9 : 0.7} dark={theme === "stormy"} />
          </div>
          <div className="cloud cloud-2 absolute top-32 right-[15%] animate-float-cloud-slow">
            <CloudSVG opacity={theme === "stormy" ? 0.85 : 0.6} dark={theme === "stormy"} scale={1.2} />
          </div>
          <div className="cloud cloud-3 absolute top-24 left-[45%] animate-float-cloud-slower">
            <CloudSVG opacity={theme === "stormy" ? 0.8 : 0.5} dark={theme === "stormy"} scale={0.9} />
          </div>
        </div>
      )}

      {/* Rain */}
      {theme === "rainy" && (
        <div className="rain-container absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="raindrop absolute w-0.5 h-12 bg-gradient-to-b from-blue-300/60 to-blue-400/20 animate-fall-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Thunder and Lightning */}
      {theme === "stormy" && (
        <>
          <div className="thunder-container absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="raindrop absolute w-1 h-16 bg-gradient-to-b from-blue-400/70 to-blue-500/30 animate-fall-rain-heavy"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animationDuration: `${0.3 + Math.random() * 0.3}s`,
                }}
              />
            ))}
          </div>
          <div className="lightning absolute inset-0 bg-yellow-200/0 animate-lightning" />
          <div className="lightning-bolt absolute top-10 left-1/3 w-1 h-40 bg-yellow-300 animate-lightning-bolt opacity-0" />
        </>
      )}

      {/* Snow */}
      {theme === "snow" && (
        <div className="snow-container absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="snowflake absolute w-2 h-2 bg-white rounded-full animate-fall-snow"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* Fog */}
      {theme === "fog" && (
        <div className="fog-container absolute inset-0">
          <div className="fog-layer absolute inset-0 bg-gradient-to-b from-gray-300/20 via-gray-400/30 to-gray-300/20 animate-fog-drift" />
          <div className="fog-layer absolute inset-0 bg-gradient-to-t from-gray-400/20 via-gray-300/30 to-gray-400/20 animate-fog-drift-reverse" />
        </div>
      )}

      {/* Wind lines */}
      {theme === "windy" && (
        <div className="wind-container absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="wind-line absolute h-0.5 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent animate-wind-blow"
              style={{
                top: `${10 + Math.random() * 80}%`,
                width: `${100 + Math.random() * 200}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Stars for night */}
      {theme === "night" && (
        <>
          <div className="moon absolute top-16 right-24 w-24 h-24 rounded-full bg-gray-100 shadow-[0_0_40px_20px_rgba(255,255,255,0.3)] animate-pulse-slow" />
          <div className="stars-container absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="star absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CloudSVG({ opacity = 0.7, dark = false, scale = 1 }: { opacity?: number; dark?: boolean; scale?: number }) {
  const color = dark ? "#4b5563" : "#e5e7eb"
  return (
    <svg
      width={120 * scale}
      height={60 * scale}
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <ellipse cx="30" cy="40" rx="20" ry="18" fill={color} />
      <ellipse cx="50" cy="30" rx="25" ry="22" fill={color} />
      <ellipse cx="75" cy="35" rx="22" ry="20" fill={color} />
      <ellipse cx="95" cy="42" rx="18" ry="16" fill={color} />
      <rect x="20" y="38" width="85" height="20" fill={color} />
    </svg>
  )
}
