"use client"

import useSWR from "swr"
import { useLocationCtx } from "../contexts/location-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import type { ForecastAIResponse } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns"

const postFetcher = async (url: string, body: object) => {
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

function getHourlyData(location: string, date: Date) {
    const hours = Array.from({ length: 24 }).map((_, i) => i);
    const requests = hours.map(hour => {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const formattedDate = format(date, "yyyy-MM-dd");
        return postFetcher(`/api/proxy/weather/forecast`, { location, date: formattedDate, time });
    });
    return Promise.all(requests);
}

export function HourlyForecastGraph() {
  const { location } = useLocationCtx()
  const { data, error, isLoading } = useSWR(location ? [location, new Date()] : null, ([loc, date]) => getHourlyData(loc, date));

  const chartData = data?.map(d => ({
      time: d.time,
      temp: d.weather.temperature.current,
  })).filter((_, i) => i % 2 === 0); // show every 2 hours to declutter

  return (
    <Card className="border-muted section-in">
      <CardHeader>
        <CardTitle className="text-balance">Today's Temperature Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {!location && (
          <Alert>
            <AlertTitle>Enter a location</AlertTitle>
            <AlertDescription>See the hourly temperature graph for your location.</AlertDescription>
          </Alert>
        )}
        {isLoading && <div className="flex items-center justify-center p-8"><Spinner /></div>}
        {error && <div className="p-4 text-red-500 text-xs">{error.message}</div>}
        {chartData && (
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                    <XAxis dataKey="time" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={{ stroke: 'hsl(var(--muted-foreground))' }} />
                    <YAxis unit="°C" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={{ stroke: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--card-foreground))'
                      }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8, fill: 'hsl(var(--primary))' }} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
                </LineChart>
            </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
