
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { location, days = 7 } = await request.json();
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Weather API key is not configured' }, { status: 500 });
  }

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}&aqi=no&alerts=no`;

  try {
    const response = await axios.get(apiUrl);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching from WeatherAPI:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to fetch weather data', details: error.response?.data || error.message }, { status: error.response?.status || 500 });
  }
}
