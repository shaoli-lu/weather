'use client';

import React, { useState, useEffect } from 'react';
import { ALL_CITIES, FOCUSED_CITIES } from '@/lib/cities';
import { fetchWeather, WeatherData } from '@/lib/weather';
import Slideshow from '@/components/Slideshow';
import CityList from '@/components/CityList';
import HelpModal from '@/components/HelpModal';
import SightingsTab from '@/components/SightingsTab';
import SubmitSighting from '@/components/SubmitSighting';
import ModerateSightings from '@/components/ModerateSightings';
import { formatTimeParts, formatLocalDate, formatChineseDate } from '@/lib/timeUtils';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div style={{ minHeight: '64px' }}></div>;

  const { timeStr, period, tz } = formatTimeParts(time);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 12px var(--accent-glow-strong)',
          animation: 'pulse-dot 2s infinite'
        }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{
            fontSize: '2rem', fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {timeStr}
          </span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase'
          }}>
            {period}
          </span>
          {tz && <span style={{
            fontSize: '0.75rem',
            fontWeight: 750,
            color: 'var(--accent)',
            marginLeft: '4px',
            opacity: 0.9,
            letterSpacing: '0.05em'
          }}>{tz}</span>}
        </div>
      </div>
      <div style={{
        fontSize: '0.65rem', fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        marginTop: '4px',
        opacity: 0.7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        textAlign: 'center'
      }}>
        <span>{formatLocalDate(time)}</span>
        <span style={{ color: 'var(--accent)', opacity: 0.8, marginLeft: 0 }}>
          {formatChineseDate(time)}
        </span>
      </div>
    </div>
  );
};

/* Animated floating background orbs */
const BackgroundOrbs = () => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0,212,255,0.05), transparent 70%)',
      bottom: '-200px', left: '-100px',
      animation: 'float-orb 30s ease-in-out infinite alternate-reverse'
    }} />
    <div style={{
      position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(168,85,247,0.04), transparent 70%)',
      top: '40%', right: '-80px',
      animation: 'float-orb 22s ease-in-out infinite alternate'
    }} />
  </div>
);

export default function Home() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'slideshow' | 'cities' | 'hot' | 'cool' | 'sightings' | 'submit' | 'moderate'>('sightings');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [loadAll, setLoadAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);

  const CACHE_KEY = 'sunrise_city_weather_cache_v1';
  const INITIAL_CITY_BATCH_SIZE = 6;
  const BATCH_FETCH_SIZE = 8;

  const loadCache = (): WeatherData[] => {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Clearing invalid weather cache', error);
      window.localStorage.removeItem(CACHE_KEY);
      return [];
    }
  };

  const saveCache = (items: WeatherData[]) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Unable to persist weather cache', error);
    }
  };

  const loadCities = async (cities: string[], currentData: WeatherData[] = data) => {
    if (cities.length === 0) return;
    setLoadingMore(true);

    const existingCache = new Map<string, WeatherData>(currentData.map((item) => [item.queryCity, item]));
    const missingCities = cities.filter((city) => !existingCache.has(city));
    if (missingCities.length === 0) {
      setLoadingMore(false);
      return;
    }

    const newItems: WeatherData[] = [];
    for (let i = 0; i < missingCities.length; i += BATCH_FETCH_SIZE) {
      const batch = missingCities.slice(i, i + BATCH_FETCH_SIZE);
      const settled = await Promise.allSettled(batch.map(async (city) => {
        try {
          const result = await fetchWeather(city);
          existingCache.set(city, result);
          return result;
        } catch (error) {
          console.warn(`Failed to fetch weather for ${city}:`, error);
          return existingCache.get(city) || null;
        }
      }));

      settled.forEach((item) => {
        if (item.status === 'fulfilled' && item.value) {
          newItems.push(item.value);
        }
      });
    }

    if (newItems.length > 0) {
      setData((prev) => {
        const merged = new Map<string, WeatherData>(prev.map((item) => [item.queryCity, item]));
        newItems.forEach((item) => merged.set(item.queryCity, item));
        const combined = Array.from(merged.values());
        saveCache(combined);
        return combined;
      });
    }

    setLoadingMore(false);
  };

  useEffect(() => {
    setMounted(true);

    const initializeCities = async () => {
      setLoading(true);
      try {
        const cached = loadCache();
        if (cached.length > 0) {
          setData(cached);
        }

        const focusedInitial = FOCUSED_CITIES.slice(0, INITIAL_CITY_BATCH_SIZE);
        const cachedMap = new Map<string, WeatherData>(cached.map((item) => [item.queryCity, item]));
        const toFetch = focusedInitial.filter((city) => !cachedMap.has(city));
        await loadCities(toFetch, cached);
      } catch (error) {
        console.error('Critical error loading weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeCities();
  }, []);

  const filteredData = data.filter(item =>
    item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleCount = loadAll ? ALL_CITIES.length : INITIAL_CITY_BATCH_SIZE;

  const getSortedData = (tab: typeof activeTab) => {
    switch (tab) {
      case 'cities':
        return [...filteredData].sort((a, b) => {
          const aIndex = FOCUSED_CITIES.indexOf(a.queryCity);
          const bIndex = FOCUSED_CITIES.indexOf(b.queryCity);
          const aPriority = aIndex !== -1 ? aIndex : 999;
          const bPriority = bIndex !== -1 ? bIndex : 999;
          if (aPriority !== bPriority) return aPriority - bPriority;
          const aName = `${a.city} ${a.country}`;
          const bName = `${b.city} ${b.country}`;
          return aName.localeCompare(bName);
        });
      case 'hot':
        return [...filteredData].sort((a, b) => b.temp_c - a.temp_c);
      case 'cool':
        return [...filteredData].sort((a, b) => a.temp_c - b.temp_c);
      default:
        return filteredData;
    }
  };

  const tabs = [
    { id: 'sightings', label: '🌅 Sightings 社区', emoji: '🌅' },
    { id: 'submit', label: '📤 Submit 发布', emoji: '📤' },
    { id: 'cities', label: '🌍 Cities 城市', emoji: '🌍' },
    { id: 'slideshow', label: '▶ Slideshow 幻灯片', emoji: '▶' },
    { id: 'hot', label: '🔥 Hot 高温', emoji: '🔥' },
    { id: 'cool', label: '❄️ Cool 凉爽', emoji: '❄️' },
    { id: 'moderate', label: '🛡️ Moderate 审核', emoji: '🛡️' }
  ];

  const visibleData = getSortedData(activeTab).slice(0, visibleCount);

  const handleToggleLoadAll = async () => {
    if (loadAll) {
      setLoadAll(false);
      return;
    }

    setLoadAll(true);
    const missing = ALL_CITIES.filter((city) => !data.some((item) => item.queryCity === city));
    await loadCities(missing);
  };

  return (
    <>
      <BackgroundOrbs />
      <main className="main-container">
        {/* HEADER */}
        <header style={{
          width: '100%',
          marginBottom: '16px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '12px',
          alignItems: 'center',
        }}>
          {/* BRANDING: Left */}
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{
              fontSize: '1.8rem', fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'baseline',
            }}>
              {/* "Sun" in rainbow */}
              <span style={{
                background: 'linear-gradient(90deg, #ff2d2d, #ff6b1a, #ffb800)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Sun</span>
              {/* "R" */}
              <span style={{
                background: 'linear-gradient(90deg, #ffb800, #ffe14d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>R</span>
              {/* "ise" with mini sun replacing the dot on the i */}
              <span style={{ position: 'relative', display: 'inline' }}>
                {/* Mini sun positioned over the "i" dot */}
                <span style={{
                  position: 'absolute',
                  top: '-0.05em',
                  left: '0.18em',
                  transform: 'translateX(-50%)',
                  width: '8px',
                  height: '8px',
                  display: 'block',
                  zIndex: 2,
                }}>
                  {/* Sun core */}
                  <span style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffdd00, #ff8c00)',
                    boxShadow: '0 0 6px #ffaa00, 0 0 12px rgba(255,170,0,0.4)',
                    animation: 'sun-dot-pulse 2s ease-in-out infinite',
                  }} />
                  {/* Sun rays ring */}
                  <span style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '12px', height: '12px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,200,0,0.4)',
                    animation: 'sun-dot-spin 6s linear infinite',
                  }} />
                </span>
                {/* The actual "ise" text with dotless i */}
                <span style={{
                  background: 'linear-gradient(90deg, #ffe14d, #7cff6b, #00d4ff, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>ıse</span>
              </span>
            </h1>
            <p style={{
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginTop: '4px',
              opacity: 0.6,
              textAlign: 'center',
              whiteSpace: 'normal'
            }}>Natural Red Light Therapy / 自然红光健康</p>
          </div>

          {/* LIVE CLOCK: Center */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LiveClock />
          </div>

          {/* SEARCHBOX: Right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div className="search-container" style={{ width: '100%', maxWidth: '280px' }}>
              <div className="search-wrapper" style={{ maxWidth: '100%' }}>
                <div className="search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search cities / 搜索城市..."
                  className="glass-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE HEADER FALLBACK */}
        <style>{`
          @media (max-width: 768px) {
            header {
              grid-template-columns: 1fr !important;
              text-align: center;
              gap: 18px !important;
            }
            header > div {
              justify-content: center !important;
              align-items: center !important;
            }
            header > div:first-child {
              align-items: center !important;
            }
            .search-wrapper {
              max-width: 100% !important;
            }
          }
        `}</style>

        {/* TAB BAR */}
        <nav className="tab-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`glass-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <section style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!mounted || loading ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '80px 0'
            }}>
              <div className="loading-spinner"></div>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginTop: '16px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
              }}>
                Gathering the horizon / 正在览集天际...
              </p>
            </div>
          ) : (
            <div style={{ width: '100%', flex: 1 }}>
              {activeTab === 'slideshow' && (
                <Slideshow data={visibleData} />
              )}
              {(activeTab === 'cities' || activeTab === 'hot' || activeTab === 'cool') && (
                <>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, minWidth: '240px' }}>
                      {loadingMore
                        ? 'Loading remaining city cards...'
                        : loadAll
                          ? `Showing ${visibleData.length} cities.`
                          : `Showing first ${visibleCount} cities. Load all to expand.`}
                    </div>
                    <button
                      onClick={handleToggleLoadAll}
                      className="glass-button"
                      style={{
                        minWidth: '180px',
                        padding: '12px 20px',
                        background: 'rgba(88, 137, 166, 0.92)',
                        color: '#f8fbff',
                        borderColor: 'rgba(255,255,255,0.14)',
                        boxShadow: '0 14px 32px rgba(0, 0, 0, 0.14)',
                        fontWeight: 700,
                        letterSpacing: '0.03em'
                      }}
                    >
                      {loadAll ? 'Show first 6' : 'Load All Cities'}
                    </button>
                  </div>
                  <CityList data={visibleData} type={activeTab as any} />
                </>
              )}
              {activeTab === 'sightings' && (
                <SightingsTab />
              )}
              {activeTab === 'submit' && (
                <SubmitSighting onSuccess={() => setActiveTab('sightings')} />
              )}
              {activeTab === 'moderate' && (
                <ModerateSightings />
              )}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer style={{
          marginTop: '24px',
          padding: '16px 0',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.04)'
        }}>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.1em'
          }}>
            © 2026 SunRise • Atmosphere Weather 气象天气
          </p>
        </footer>
      </main>
      <button onClick={() => setIsHelpOpen(true)} className="help-fab" aria-label="Help">
        ❓
      </button>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
