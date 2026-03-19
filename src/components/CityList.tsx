import React from 'react';
import { WeatherData, getUVDescription, getPressureDescription, getVisibilityDescription, getAQIDescription } from '@/lib/weather';

interface CityListProps {
  data: WeatherData[];
  type: 'cities' | 'hot' | 'cool';
}

export default function CityList({ data, type }: CityListProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-24 glass-card border-dashed">
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No horizons found</p>
      </div>
    );
  }

  return (
    <div className="city-grid">
      {data.map((city, index) => (
        <div
          key={`${city.queryCity}-${index}`}
          className="glass-panel p-6 flex flex-col gap-4 hover:border-accent/40 transition-colors"
        >
          {/* TOP: Astronomy Stats */}
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted uppercase tracking-tight">Sunrise: {city.sunrise}</span>
                <span className="text-[8px] font-bold text-accent uppercase">Watch: {city.sunriseAction}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-right">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted uppercase tracking-tight">Sunset: {city.sunset}</span>
                <span className="text-[8px] font-bold text-accent uppercase">Watch: {city.sunsetAction}</span>
              </div>
            </div>
          </div>

          {/* MAIN INFO */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] text-accent/60 font-bold tracking-widest uppercase mb-1">{city.country}</span>
              <h3 className="text-2xl font-bold tracking-tight leading-tight" style={{ color: 'red' }}>
                {city.city}
              </h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-extrabold text-accent tracking-tighter">
                {Math.round(city.temp_f)}°
              </span>
              <span className="text-[10px] text-muted font-bold tracking-wider mt-1">
                {city.temp_c.toFixed(1)}°C
              </span>
            </div>
          </div>

          {/* WEATHER DETAILS GRID */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-4 border-t border-b border-white/5 my-2">
            <div className="flex flex-col">
              <span className="text-[8px] text-muted font-black uppercase tracking-widest opacity-60 text-left">UV Index: </span>
              <span className="text-[10px] font-bold text-left" style={{ color: 'red' }}>{city.uv} ({getUVDescription(city.uv)})</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-muted font-black uppercase tracking-widest opacity-60 text-left">Humidity: </span>
              <span className="text-[10px] font-bold text-left" style={{ color: 'red' }}>{city.humidity}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-muted font-black uppercase tracking-widest opacity-60 text-left">Pressure: </span>
              <span className="text-[10px] font-bold text-left" style={{ color: 'red' }}>{city.pressure_mb} mb ({getPressureDescription(city.pressure_mb)})</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-muted font-black uppercase tracking-widest opacity-60 text-left">Visibility: </span>
              <span className="text-[10px] font-bold text-left" style={{ color: 'red' }}>{city.vis_km} km ({getVisibilityDescription(city.vis_km)})</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-muted font-black uppercase tracking-widest opacity-60 text-left">AQI (EPA): </span>
              <span className="text-[10px] font-bold text-left" style={{ color: 'red' }}>{city.aqi} ({getAQIDescription(city.aqi)})</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-muted font-black uppercase tracking-widest opacity-60 text-left">Daylight: </span>
              <span className="text-[10px] font-bold text-left" style={{ color: 'red' }}>{city.sun_hours}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <img src={city.icon} alt={city.condition} className="w-6 h-6 object-contain" />
              <span className="text-[11px] font-semibold text-white/70 uppercase tracking-widest">{city.condition}</span>
            </div>
            <span className="text-[10px] text-muted font-medium italic">Moon Phase: <span style={{ color: 'red' }}>{city.moon_phase}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}
