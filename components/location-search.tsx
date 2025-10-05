"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLocationCtx } from "./contexts/location-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LocationSearch() {
  const { location, setLocation, status, requestLocation } = useLocationCtx()
  const [value, setValue] = useState(location)

  useEffect(() => {
    setValue(location);
  }, [location]);

  function submit() {
    setLocation(value.trim())
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") submit()
  }

  return (
    <Card className="border-2 shadow-lg bg-card/95 backdrop-blur-sm section-in">
      <CardContent className="p-5">
        {status === 'loading' && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner className="size-5" />
            <span>Fetching your location...</span>
          </div>
        )}
        {status === 'error' && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Location Access Denied</AlertTitle>
            <AlertDescription>
              Could not access your location. Please enable location services in your browser or use the search bar below.
              <Button variant="link" onClick={requestLocation}>Try Again</Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <label className="text-sm font-semibold text-foreground" htmlFor="location">
              Location
            </label>
          </div>
          <div className="flex w-full items-center gap-2">
            <Input
              id="location"
              placeholder="e.g. London, New York, or 51.52,-0.11"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 transition-all focus-visible:shadow-lg focus-visible:scale-[1.01] bg-background/50 backdrop-blur-sm border-2"
            />
            <Button 
              onClick={submit} 
              aria-label="Set location" 
              className="transition-all active:scale-95 hover:scale-105 shadow-md hover:shadow-lg font-semibold"
            >
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
