export interface WeatherData {
  city: string;
  queryCity: string;
  country: string;
  temp_c: number;
  temp_f: number;
  condition: string;
  icon: string;
  sunrise: string;
  sunset: string;
  sunriseAction: string;
  sunsetAction: string;
  moon_phase: string;
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "";

const subtract30Minutes = (timeStr: string): string => {
  if (!timeStr || timeStr === "N/A") return "N/A";
  try {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    
    let totalMinutes = hours * 60 + minutes - 30;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    
    const newHours24 = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    
    const newPeriod = newHours24 >= 12 ? "PM" : "AM";
    let newHours12 = newHours24 % 12;
    if (newHours12 === 0) newHours12 = 12;
    
    return `${newHours12.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
  } catch (e) {
    return "N/A";
  }
};

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  if (!API_KEY) {
    throw new Error("No WeatherAPI key found in environment variables");
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=1&aqi=no&alerts=no`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const temp_f = data.current.temp_f;
    // Enforce the user's formula: c = (F - 32) * 5/9
    const temp_c = Number(((temp_f - 32) * 5 / 9).toFixed(3));
    
    const astro = data.forecast?.forecastday?.[0]?.astro;
    const sunrise = astro?.sunrise || "N/A";
    const sunset = astro?.sunset || "N/A";
    
    const countryString = data.location.country;
    const country = countryString === "United States of America" ? "" : countryString;
    
    return {
      city: data.location.name,
      queryCity: city,
      country,
      temp_c,
      temp_f,
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      sunrise,
      sunset,
      sunriseAction: subtract30Minutes(sunrise),
      sunsetAction: subtract30Minutes(sunset),
      moon_phase: astro?.moon_phase || "N/A",
    };
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    throw error;
  }
};

