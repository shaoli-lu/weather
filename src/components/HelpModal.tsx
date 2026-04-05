'use client';

import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            marginBottom: '8px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            Chase the Red, Save the Green 🌅
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Why drop $1000 on a red light lamp when nature does it for free? SunRise helps you hunt the perfect horizon for that sweet, healing solar glow.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(255, 115, 0, 0.15)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>🌇</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>The Red Light Hunt</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Browse cities to find the perfect atmospheric conditions. Too much smog? That's just nature's "soft filter" for maximum red light therapy.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(249, 115, 22, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>💡</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Nature vs. Tech</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                The "Hot" tab shows where the sun is literally screaming at you to come outside. Your LED panel in the bedroom could never. 
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(168, 85, 247, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>🧊</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Cooling Down</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                The "Cool" tab is for when you've had too much of a good thing. (Also known as: "I am becoming a lobster").
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(0, 212, 255, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>🧘</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Zen State</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Use Slideshow mode to mentally transport yourself to a location where health is free and the sunsets are actually red.
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '32px', 
          padding: '16px', 
          borderRadius: 'var(--border-radius-md)', 
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
            "Stop buying lamps. Start chasing horizons." 
            <br />— The SunRise Wellness Squad 🧘‍♀️✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
