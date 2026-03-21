import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'City is required' }, { status: 400 });
  }

  // Use either the private key or the public one from the server side
  const API_KEY = (process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY || "").trim();

  if (!API_KEY) {
    return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=1&aqi=yes&alerts=no`,
      {
        next: { revalidate: 60 }, // Optional: cache for 60 seconds
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || response.statusText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Internal error fetching weather for ${city}:`, error);
    return NextResponse.json({ error: 'Failed to fetch from weather service' }, { status: 500 });
  }
}
