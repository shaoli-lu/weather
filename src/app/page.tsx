'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ALL_CITIES, FOCUSED_CITIES } from '@/lib/cities';
import { fetchWeather, WeatherData } from '@/lib/weather';
import Slideshow from '@/components/Slideshow';
import CityList from '@/components/CityList';

export default function Home() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'slideshow' | 'cities' | 'hot' | 'cool'>('slideshow');
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
          // Check if in FOCUSED_CITIES using queryCity
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

  return (
    <main className="main-container">
      <header className="relative w-full mb-12 min-h-[50px]">
        {/* BRANDING: Responsive placement */}
        <div className="flex flex-col items-center md:items-start md:absolute md:top-0 md:left-0 animate-fade-in">
          <h1 className="text-2xl font-black tracking-tighter text-white leading-none">
            Sun<span className="text-accent">Rise</span>
          </h1>
          <p className="hidden md:block text-[9px] text-muted font-bold tracking-widest uppercase mt-1 opacity-60">Appreciate the beauty of every horizon</p>
        </div>

        {/* SEARCHBOX: Consistent Top Right via CSS */}
        <div className="search-container">
          <div className="search-wrapper">
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <nav className="tab-container">
        {[
          { id: 'slideshow', label: 'Slideshow' },
          { id: 'cities', label: 'Cities' },
          { id: 'hot', label: 'Hot' },
          { id: 'cool', label: 'Cool' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`glass-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="w-full flex-1">
        {!mounted || loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loading-spinner"></div>
            <p className="text-muted text-sm font-medium mt-4 tracking-widest uppercase animate-pulse">
              Gathering the horizon...
            </p>
          </div>
        ) : (
          <div className="w-full">
            {activeTab === 'slideshow' && (
              <Slideshow data={getSortedData('cities')} />
            )}
            {activeTab !== 'slideshow' && (
              <CityList data={getSortedData(activeTab)} type={activeTab} />
            )}
          </div>
        )}
      </section>

      <footer className="mt-20 py-8 text-center text-muted text-xs border-t border-white/5">
        <p>&copy; 2026 SunRise &bull; Atmosphere Weather</p>
      </footer>
    </main>
  );
}
