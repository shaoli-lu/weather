import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
        cache: 'no-store',
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

    // Fetch more accurate air quality data from Open-Meteo using coordinates
    const lat = data.location?.lat;
    const lon = data.location?.lon;
    if (typeof lat === 'number' && typeof lon === 'number') {
      try {
        const aqResponse = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`,
          { signal: AbortSignal.timeout(3000) }
        );
        if (aqResponse.ok) {
          const aqData = await aqResponse.json();
          const usAqi = aqData.current?.us_aqi;
          if (typeof usAqi === 'number') {
            let epaIndex = 1;
            if (usAqi <= 50) epaIndex = 1;
            else if (usAqi <= 100) epaIndex = 2;
            else if (usAqi <= 150) epaIndex = 3;
            else if (usAqi <= 200) epaIndex = 4;
            else if (usAqi <= 300) epaIndex = 5;
            else epaIndex = 6;

            if (!data.current) {
              data.current = {};
            }
            if (!data.current.air_quality) {
              data.current.air_quality = {};
            }
            data.current.air_quality['us-aqi'] = usAqi;
            data.current.air_quality['us-epa-index'] = epaIndex;
          }
        }
      } catch (aqError) {
        console.error(`Error fetching air quality from Open-Meteo for ${city}:`, aqError);
      }
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error(`Internal error fetching weather for ${city}:`, error);
    return NextResponse.json({ error: 'Failed to fetch from weather service' }, { status: 500 });
  }
}
