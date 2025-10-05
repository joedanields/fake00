export type Coordinates = { lat: number; lon: number }

export type CurrentWeatherResponse = {
  location: {
    name: string
    coordinates?: Coordinates
    timezone?: string
    localtime?: string
  }
  current: {
    temperature_c: number
    condition: string
    humidity: number
    wind_kph: number
  }
}

export type ForecastAIResponse = {
  location: { name: string }
  date: string // YYYY-MM-DD
  time: string // HH:mm
  weather: {
    temperature: { current: number; feels_like: number }
    condition: { text: string }
    humidity: number
  }
  ai_analysis: string
}

export type RecommendationsResponse = {
  location: string
  date: string
  time: string
  recommendations: string // multiline string
}
