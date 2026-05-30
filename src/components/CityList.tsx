'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData, getUVDescription, getPressureDescription, getVisibilityDescription, getAQIDescription, getMoonPhaseChinese, getMoonPhaseEmoji } from '@/lib/weather';
import { getCityChinese, getCityMetadata } from '@/lib/cities';
import { formatTimeParts } from '@/lib/timeUtils';

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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4" /><path d="M12 18v4" />
    <path d="m4.93 4.93 2.83 2.83" /><path d="m16.24 16.24 2.83 2.83" />
    <path d="M2 12h4" /><path d="M18 12h4" />
    <path d="m4.93 19.07 2.83-2.83" /><path d="m16.24 7.76 2.83-2.83" />
  </svg>
);

const SunsetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10V2" /><path d="m4.93 10.93 1.41 1.41" />
    <path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" />
    <path d="M22 22H2" /><path d="M16 18a4 4 0 0 0-8 0" />
  </svg>
);

export function CityClock({ tzId, isLarge = false }: { tzId: string; isLarge?: boolean }) {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const framePadding = isLarge ? '12px 18px' : '8px 12px';
  const timeFontSize = isLarge ? '2.1rem' : '1.35rem';
  const periodFontSize = isLarge ? '0.9rem' : '0.72rem';
  const tzFontSize = isLarge ? '0.68rem' : '0.58rem';
  const dotSize = isLarge ? '7px' : '5px';

  if (!mounted) {
    return (
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
        padding: framePadding,
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)',
        marginTop: '8px',
        width: 'fit-content'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: tzFontSize, color: 'var(--text-muted)' }}>
          <span style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }} />
          <span>Loading clock...</span>
        </div>
      </div>
    );
  }

  const { timeStr, period, tz } = formatTimeParts(time, tzId);

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: '4px',
      padding: framePadding,
      borderRadius: '8px',
      background: 'rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.15)',
      marginTop: '8px',
      width: 'fit-content'
    }}>
      {/* Time digits + indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '6px',
      }}>
        {/* Pulsing live dot */}
        <span style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: '#00ffcc', // cyan neon glow
          boxShadow: '0 0 8px #00ffcc, 0 0 16px #00ffcc',
          alignSelf: 'center',
          animation: 'pulse-dot 2s infinite'
        }} />
        <span style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
          fontSize: timeFontSize,
          fontWeight: 800,
          color: '#00ffcc', // neon green/cyan
          textShadow: '0 0 6px rgba(0, 255, 204, 0.3)',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1
        }}>
          {timeStr}
        </span>
        <span style={{
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: periodFontSize,
          fontWeight: 700,
          color: 'rgba(0, 255, 204, 0.7)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {period}
        </span>
      </div>
      
      {/* Timezone name */}
      {tz && (
        <span style={{
          fontSize: tzFontSize,
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          opacity: 0.85
        }}>
          {tz}
        </span>
      )}
    </div>
  );
}

export default function CityList({ data, type }: CityListProps) {
  if (data.length === 0) {
    return (
      <div className="glass-panel" style={{
        textAlign: 'center', padding: '80px 24px',
        borderStyle: 'dashed'
      }}>
        <p style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          No horizons found / 未发现任何数据
        </p>
      </div>
    );
  }

  return (
    <div className="city-grid">
      {data.map((city, index) => {
        const tempColor = getTempColor(city.temp_f);
        const metadata = getCityMetadata(city.queryCity);

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
              alignItems: 'stretch',
              gap: '12px',
            }}>
              {/* Sunrise Box */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(255, 170, 0, 0.06) 0%, rgba(255, 107, 53, 0.02) 100%)',
                border: '1px solid rgba(255, 170, 0, 0.1)',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.02)',
              }}>
                <SunriseIcon />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Sunrise / 日出
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.01em', lineHeight: 1.1 }}>
                    {city.sunrise}
                  </span>
                  <span style={{ fontSize: '0.55rem', fontWeight: 650, color: 'var(--accent)', opacity: 0.9 }}>
                    🌅 推荐: {city.sunriseAction}
                  </span>
                </div>
              </div>

              {/* Sunset Box */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.06) 0%, rgba(168, 85, 247, 0.02) 100%)',
                border: '1px solid rgba(244, 63, 94, 0.1)',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.02)',
                textAlign: 'right',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Sunset / 日落
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.01em', lineHeight: 1.1 }}>
                    {city.sunset}
                  </span>
                  <span style={{ fontSize: '0.55rem', fontWeight: 650, color: 'var(--accent-secondary)', opacity: 0.9 }}>
                    🌆 推荐: {city.sunsetAction}
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
                {/* Local clock */}
                <CityClock tzId={city.tz_id} />
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

            {/* CHARACTERISTICS & LANGUAGES */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.02) 0%, rgba(168, 85, 247, 0.02) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem' }}>
                <span style={{
                  fontSize: '0.58rem', fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap'
                }}>🗣 Language / 语言</span>
                <span style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.68rem'
                }}>{metadata.languages}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.7rem', lineHeight: 1.45 }}>
                <span style={{
                  fontSize: '0.58rem', fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  paddingTop: '1px'
                }}>✨ Highlights / 特色</span>
                <span style={{
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '0.68rem',
                  opacity: 0.9
                }}>{metadata.characteristics}</span>
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
                { label: 'UV Index / 紫外线指数', value: `${city.uv}`, desc: getUVDescription(city.uv) },
                { label: 'Humidity / 湿度', value: `${city.humidity}%`, desc: null },
                { label: 'Pressure / 气压', value: `${city.pressure_mb} mb`, desc: getPressureDescription(city.pressure_mb) },
                { label: 'Visibility / 能见度', value: `${city.vis_km} km`, desc: getVisibilityDescription(city.vis_km) },
                { label: 'EPA Index / 空气质量', value: `${city.aqi}`, desc: getAQIDescription(city.aqi) },
                { label: 'Daylight / 日照', value: city.sun_hours, desc: null },
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
                {getMoonPhaseEmoji(city.moon_phase)} {city.moon_phase}
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
