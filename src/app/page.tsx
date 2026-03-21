'use client';

import React, { useState, useEffect } from 'react';
import { ALL_CITIES, FOCUSED_CITIES } from '@/lib/cities';
import { fetchWeather, WeatherData } from '@/lib/weather';
import Slideshow from '@/components/Slideshow';
import CityList from '@/components/CityList';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatParts = () => {
    const hhmmss = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const [timeStr, period] = hhmmss.split(' ');
    return { timeStr, period };
  };

  if (!mounted) return <div style={{ minHeight: '64px' }}></div>;

  const { timeStr, period } = formatParts();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', paddingBottom: '8px' }}>
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
        </div>
      </div>
      <span style={{
        fontSize: '0.65rem', fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.3em',
        marginTop: '4px',
        opacity: 0.7
      }}>
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </span>
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
  const [activeTab, setActiveTab] = useState<'slideshow' | 'cities' | 'hot' | 'cool'>('cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadAllData = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(ALL_CITIES.map(city => fetchWeather(city)));
        setData(results);
      } catch (error) {
        console.error("Critical error loading weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const filteredData = data.filter(item =>
    item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    { id: 'cities', label: '🌍 Cities', emoji: '🌍' },
    { id: 'hot', label: '🔥 Hot', emoji: '🔥' },
    { id: 'cool', label: '❄️ Cool', emoji: '❄️' },
    { id: 'slideshow', label: '▶ Slideshow', emoji: '▶' }
  ];

  return (
    <>
      <BackgroundOrbs />
      <main className="main-container">
        {/* HEADER */}
        <header style={{
          width: '100%',
          marginBottom: '48px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'center',
        }}>
          {/* BRANDING: Left */}
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{
              fontSize: '1.6rem', fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>
              <span style={{ color: 'var(--text-primary)' }}>Sun</span>
              <span className="gradient-text">Rise</span>
            </h1>
            <p style={{
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginTop: '4px',
              opacity: 0.6
            }}>Appreciate every horizon</p>
          </div>

          {/* LIVE CLOCK: Center */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LiveClock />
          </div>

          {/* SEARCHBOX: Right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className="search-container" style={{ width: '100%', maxWidth: '280px' }}>
              <div className="search-wrapper" style={{ maxWidth: '100%' }}>
                <div className="search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search cities..."
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
        <nav className="tab-container" style={{ marginTop: '8px' }}>
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
        <section style={{ width: '100%', flex: 1 }}>
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
                Gathering the horizon...
              </p>
            </div>
          ) : (
            <div style={{ width: '100%' }}>
              {activeTab === 'slideshow' && (
                <Slideshow data={getSortedData('cities')} />
              )}
              {activeTab !== 'slideshow' && (
                <CityList data={getSortedData(activeTab)} type={activeTab} />
              )}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer style={{
          marginTop: '80px',
          padding: '24px 0',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.04)'
        }}>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.1em'
          }}>
            © 2026 SunRise • Atmosphere Weather
          </p>
        </footer>
      </main>
    </>
  );
}
