'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData } from '@/lib/weather';

export default function Slideshow({ data }: { data: WeatherData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // Reset index if data changes (e.g. search) to avoid out of bounds
    setCurrentIndex(0);
  }, [data.length]);

  useEffect(() => {
    if (isPaused || data.length <= 1) return;

    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % data.length);
        setFade(true);
      }, 500); // Quick fade
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timer);
  }, [isPaused, data.length]);

  if (data.length === 0) {
    return (
      <div className="text-center py-20 glass-card">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Searching for the sun...</p>
      </div>
    );
  }

  const currentCity = data[currentIndex];

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center min-h-[450px] cursor-pointer"
      onClick={() => setIsPaused(!isPaused)}
    >
      {/* Slides Content */}
      <div className={`w-full max-w-4xl px-4 flex flex-col items-center transition-all duration-700 ease-in-out ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}`}>

        {/* INFO STACK - FORCED CENTER */}
        <div className="flex flex-col items-center justify-center w-full gap-12 z-10">

          {/* 1. Astronomy Row (Sunrise/Sunset) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">Sunrise {currentCity.sunrise}</span>
                <span className="text-[11px] font-extrabold text-accent uppercase tracking-[0.2em]">Watch at {currentCity.sunriseAction}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">Sunset {currentCity.sunset}</span>
                <span className="text-[11px] font-extrabold text-accent uppercase tracking-[0.2em]">Watch at {currentCity.sunsetAction}</span>
              </div>
            </div>
          </div>

          {/* 2. Main City Panel */}
          <div className="glass-panel w-full p-10 md:p-16 flex flex-col items-center justify-center gap-10 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-[100px]"></div>

            {/* Location & City */}
            <div className="flex flex-col items-center text-center w-full">
              <span className="text-accent/70 font-bold tracking-[0.5em] uppercase text-[10px] mb-4">
                Now in {currentCity.country}
              </span>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none mb-6">
                {currentCity.city}
              </h2>

              <div className="flex flex-col items-center gap-3">
                <img
                  src={currentCity.icon.startsWith('//') ? `https:${currentCity.icon.replace('64x64', '128x128')}` : currentCity.icon}
                  alt=""
                  className="w-14 h-14 object-contain animate-float"
                />
                <span className="text-lg font-bold text-muted uppercase tracking-[0.4em]">{currentCity.condition}</span>
              </div>
            </div>

            {/* Temperature & Moon */}
            <div className="flex flex-col items-center text-center w-full">
              <div className="flex items-baseline justify-center gap-4">
                <span className="text-8xl md:text-[10rem] font-black text-accent tracking-tighter leading-none">
                  {Math.round(currentCity.temp_f)}°
                </span>
                <span className="text-2xl md:text-3xl font-light text-muted opacity-40">
                  / {currentCity.temp_c.toFixed(1)}°C
                </span>
              </div>

              <div className="w-20 h-[1.5px] bg-accent/20 my-8"></div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] font-black text-muted uppercase tracking-[0.5em]">
                  {currentCity.moon_phase}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Indicators */}
      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {data.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-white/10'
                }`}
            />
          ))}
        </div>

        <div className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-300 ${isPaused ? 'text-accent' : 'text-muted'}`}>
          {isPaused ? 'PAUSED' : 'LIVE'}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
