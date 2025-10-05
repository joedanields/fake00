"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type LocationStatus = "idle" | "loading" | "success" | "error";

type LocationContextValue = {
  location: string
  setLocation: (v: string) => void
  status: LocationStatus
  requestLocation: () => void
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState<LocationStatus>("idle");

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude},${longitude}`);
        setStatus("success");
      },
      () => {
        setStatus("error"); // User denied or other error
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);


  return <LocationContext.Provider value={{ location, setLocation, status, requestLocation }}>{children}</LocationContext.Provider>
}

export function useLocationCtx() {
  const ctx = useContext(LocationContext)
  if (!ctx) {
    throw new Error("useLocationCtx must be used within LocationProvider")
  }
  return ctx
}
