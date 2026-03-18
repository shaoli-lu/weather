'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#ff8c00', '#ff4500', '#ffd700', '#ff6b6b', '#4ecdc4'],
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return <>{children}</>;
}
