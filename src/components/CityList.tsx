import React from 'react';
import { WeatherData, getUVDescription, getPressureDescription, getVisibilityDescription, getAQIDescription, getMoonPhaseChinese } from '@/lib/weather';
import { getCityChinese } from '@/lib/cities';

interface CityListProps {
  data: WeatherData[];
  type: 'cities' | 'hot' | 'cool';
}

/* Small helper to get a temp-based accent color */
const getTempColor = (temp_f: number): string => {
  if (temp_f >= 90) return '#ff6b35';
  if (temp_f >= 75) return '#f97316';
  if (temp_f >= 60) return '#00d4ff';
  if (temp_f >= 45) return '#38bdf8';
  return '#818cf8';
};

/* Tiny SVG icons for weather details */
const SunriseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4" /><path d="M12 18v4" />
    <path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" />
    <path d="M2 12h4" /><path d="M18 12h4" />
    <path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76 2.83-2.83" />
  </svg>
);

const SunsetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10V2" /><path d="m4.93 10.93 1.41 1.41" />
    <path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" />
    <path d="M22 22H2" /><path d="M16 18a4 4 0 0 0-8 0" />
  </svg>
);

export default function CityList({ data, type }: CityListProps) {
  if (data.length === 0) {
    return (
      <div className="glass-panel" style={{
        textAlign: 'center', padding: '80px 24px',
        borderStyle: 'dashed'
      }}>
        <p style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          No horizons found
        </p>
      </div>
    );
  }

  return (
    <div className="city-grid">
      {data.map((city, index) => {
        const tempColor = getTempColor(city.temp_f);

        return (
          <div
            key={`${city.queryCity}-${index}`}
            className="glass-panel card-animate"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animationDelay: `${index * 0.04}s`,
            }}
          >
            {/* ASTRONOMY ROW */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 2px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SunriseIcon />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                    {city.sunrise}
                  </span>
                  <span style={{ fontSize: '0.58rem', fontWeight: 600, color: 'var(--accent)', opacity: 0.8 }}>
                    Watch: {city.sunriseAction}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'right' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                    {city.sunset}
                  </span>
                  <span style={{ fontSize: '0.58rem', fontWeight: 600, color: 'var(--accent-secondary)', opacity: 0.8 }}>
                    Watch: {city.sunsetAction}
                  </span>
                </div>
                <SunsetIcon />
              </div>
            </div>

            <div className="glass-divider" />

            {/* MAIN INFO */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {city.country && (
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700,
                    color: 'var(--accent)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    opacity: 0.7
                  }}>
                    {city.country}
                  </span>
                )}
                <h3 style={{
                  fontSize: '1.45rem', fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  color: 'var(--text-primary)'
                }}>
                  {city.city}
                  {getCityChinese(city.city) && (
                    <span style={{ fontSize: '0.9rem', opacity: 0.5, fontWeight: 500, marginLeft: '6px' }}>
                      {getCityChinese(city.city)}
                    </span>
                  )}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{
                  fontSize: '2rem', fontWeight: 900,
                  color: tempColor,
                  letterSpacing: '-0.04em',
                  lineHeight: 1
                }}>
                  {Math.round(city.temp_f)}°
                </span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginTop: '4px'
                }}>
                  {city.temp_c.toFixed(1)}°C
                </span>
              </div>
            </div>

            {/* WEATHER DETAILS GRID */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px 16px',
              padding: '16px 0',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              {[
                { label: 'UV Index', value: `${city.uv}`, desc: getUVDescription(city.uv) },
                { label: 'Humidity', value: `${city.humidity}%`, desc: null },
                { label: 'Pressure', value: `${city.pressure_mb} mb`, desc: getPressureDescription(city.pressure_mb) },
                { label: 'Visibility', value: `${city.vis_km} km`, desc: getVisibilityDescription(city.vis_km) },
                { label: 'EPA Index', value: `${city.aqi}`, desc: getAQIDescription(city.aqi) },
                { label: 'Daylight', value: city.sun_hours, desc: null },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span className="detail-label">{item.label}</span>
                  <span className="detail-value">
                    {item.value}
                    {item.desc && <span className="descriptor"> · {item.desc}</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* FOOTER: CONDITION & MOON */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '8px',
              marginTop: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={city.icon} alt={city.condition} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>{city.condition}</span>
              </div>
              <span style={{
                fontSize: '0.62rem', fontWeight: 500,
                color: 'var(--text-muted)', fontStyle: 'italic'
              }}>
                🌙 {city.moon_phase}
                {getMoonPhaseChinese(city.moon_phase) && (
                  <span style={{ color: 'var(--accent)', marginLeft: '4px' }}>
                    {getMoonPhaseChinese(city.moon_phase)}
                  </span>
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
