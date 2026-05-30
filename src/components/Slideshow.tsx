'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData, getUVDescription, getPressureDescription, getVisibilityDescription, getAQIDescription, getMoonPhaseChinese, getMoonPhaseEmoji } from '@/lib/weather';
import { getCityChinese } from '@/lib/cities';
import { CityClock } from './CityList';

const getTempColor = (temp_f: number): string => {
  if (temp_f >= 90) return '#ff6b35';
  if (temp_f >= 75) return '#f97316';
  if (temp_f >= 60) return '#00d4ff';
  if (temp_f >= 45) return '#38bdf8';
  return '#818cf8';
};

export default function Slideshow({ data }: { data: WeatherData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setCurrentIndex(0);
  }, [data.length]);

  useEffect(() => {
    if (isPaused || data.length <= 1) return;

    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % data.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, data.length]);

  if (data.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          Searching for the sun / 正在寻找太阳...
        </p>
      </div>
    );
  }

  const safeIndex = currentIndex >= data.length ? 0 : currentIndex;
  const city = data[safeIndex];
  const tempColor = getTempColor(city.temp_f);

  return (
    <div
      style={{
        position: 'relative', width: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '480px', cursor: 'pointer'
      }}
      onClick={() => setIsPaused(!isPaused)}
    >
      {/* Atmospheric glow behind the card */}
      <div style={{
        position: 'absolute',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${tempColor}10, transparent 70%)`,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        transition: 'background 0.7s ease'
      }} />

      {/* SLIDE CONTENT */}
      <div style={{
        width: '100%', maxWidth: '900px', padding: '0 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: fade ? 1 : 0,
        transform: fade ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(8px)'
      }}>
        {/* ASTRONOMY ROW */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '500px',
          marginBottom: '24px'
        }}>
          {/* Sunrise Card */}
          <div className="glass-panel" style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, rgba(255, 170, 0, 0.06) 0%, rgba(255, 107, 53, 0.03) 100%)',
            borderColor: 'rgba(255, 170, 0, 0.12)',
            cursor: 'default'
          }} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: '1.5rem' }}>☀️</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Sunrise / 日出
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 850, color: 'var(--accent)', lineHeight: 1.2 }}>
                {city.sunrise}
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                🌅 推荐: {city.sunriseAction}
              </span>
            </div>
          </div>

          {/* Sunset Card */}
          <div className="glass-panel" style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.06) 0%, rgba(168, 85, 247, 0.03) 100%)',
            borderColor: 'rgba(244, 63, 94, 0.12)',
            cursor: 'default'
          }} onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: '1.5rem' }}>🌅</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Sunset / 日落
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 850, color: 'var(--accent-secondary)', lineHeight: 1.2 }}>
                {city.sunset}
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                🌆 推荐: {city.sunsetAction}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN GLASS PANEL */}
        <div className="glass-panel" style={{
          width: '100%', padding: '48px 40px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '32px',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Glow blob inside card */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '350px', height: '350px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${tempColor}08, transparent 70%)`,
            filter: 'blur(80px)',
            pointerEvents: 'none'
          }} />

          {/* LOCATION */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 1 }}>
            {city.country && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: 'var(--accent)', opacity: 0.7,
                letterSpacing: '0.4em', textTransform: 'uppercase',
                marginBottom: '12px'
              }}>
                {city.country}
              </span>
            )}
            <h2 className="gradient-text" style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              marginBottom: '8px'
            }}>
              {city.city}
            </h2>
            {getCityChinese(city.city) && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500, opacity: 0.6 }}>
                {getCityChinese(city.city)}
              </span>
            )}
            {/* World Clock */}
            <CityClock tzId={city.tz_id} isLarge={true} />
          </div>

          {/* CONDITION */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
            <img
              src={city.icon.startsWith('//') ? `https:${city.icon.replace('64x64', '128x128')}` : city.icon}
              alt=""
              className="animate-float"
              style={{ width: '56px', height: '56px', objectFit: 'contain' }}
            />
            <span style={{
              fontSize: '0.85rem', fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em'
            }}>{city.condition}</span>
          </div>

          {/* TEMPERATURE */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '12px', zIndex: 1 }}>
            <span style={{
              fontSize: 'clamp(4rem, 15vw, 8rem)',
              fontWeight: 900,
              color: tempColor,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              textShadow: `0 0 60px ${tempColor}30`
            }}>
              {Math.round(city.temp_f)}°
            </span>
            <span style={{
              fontSize: '1.5rem', fontWeight: 300,
              color: 'var(--text-muted)', opacity: 0.4
            }}>
              / {city.temp_c.toFixed(1)}°C
            </span>
          </div>

          <div className="glass-divider" />

          {/* WEATHER DETAILS GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px 32px',
            width: '100%', maxWidth: '640px',
            padding: '24px 0',
            zIndex: 1
          }}>
            {[
              { label: 'UV Index / 紫外线指数', value: `${city.uv}`, desc: getUVDescription(city.uv) },
              { label: 'Humidity / 湿度', value: `${city.humidity}%`, desc: null },
              { label: 'Pressure / 气压', value: `${city.pressure_mb} mb`, desc: getPressureDescription(city.pressure_mb) },
              { label: 'Visibility / 能见度', value: `${city.vis_km} km`, desc: getVisibilityDescription(city.vis_km) },
              { label: 'AQI (EPA) / 空气质量', value: `${city.aqi}`, desc: getAQIDescription(city.aqi) },
              { label: 'Daylight / 日照', value: city.sun_hours, desc: null },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  fontSize: '0.6rem', fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em'
                }}>{item.label}</span>
                <span style={{
                  fontSize: '1.1rem', fontWeight: 700,
                  color: 'var(--text-primary)'
                }}>
                  {item.value}
                </span>
                {item.desc && (
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 500,
                    color: 'var(--accent)', opacity: 0.7
                  }}>{item.desc}</span>
                )}
              </div>
            ))}
          </div>

          {/* MOON PHASE */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '2px', zIndex: 1
          }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em'
            }}>
              {getMoonPhaseEmoji(city.moon_phase)} Moon Phase / 月相
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {getMoonPhaseEmoji(city.moon_phase)} {city.moon_phase}
              {getMoonPhaseChinese(city.moon_phase) && (
                <span style={{ color: 'var(--accent)', marginLeft: '8px', opacity: 0.8 }}>
                  {getMoonPhaseChinese(city.moon_phase)}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{
        marginTop: '32px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '16px'
      }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {data.map((_, idx) => (
            <div
              key={idx}
              style={{
                height: '4px',
                borderRadius: '2px',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                width: idx === safeIndex ? '28px' : '8px',
                background: idx === safeIndex
                  ? 'linear-gradient(90deg, var(--accent), var(--accent-secondary))'
                  : 'rgba(255,255,255,0.08)'
              }}
            />
          ))}
        </div>

        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.6rem', fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: isPaused ? 'var(--accent-warm)' : 'var(--text-muted)'
        }}>
          <div className={`status-dot ${isPaused ? 'paused' : 'live'}`} />
          {isPaused ? 'PAUSED / 已暂停' : 'LIVE / 正在直播'}
        </div>
      </div>

      {/* Responsive grid fallback for small screens */}
      <style>{`
        @media (max-width: 600px) {
          .slideshow-details-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
