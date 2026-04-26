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
            SunRise & SunSet Guide 🌅
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Track the perfect moments for your solar rituals. SunRise helps you plan your day around the most beautiful transitions of light and temperature.
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
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Solar Tracking</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                View precise Sun Rise and Sun Set times for every city in your selected list, updated in real-time.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(249, 115, 22, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>⏱️</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Preparation Time</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                We recommend starting your journey 30 minutes prior to the event to allow for preparation and walking to your viewing spot.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(255, 65, 54, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>🔥</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Hot & Cold Tabs</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Quickly access the warmest and coolest cities among your selected list for instant climate comparisons.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(0, 212, 255, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>💻</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Interactive View</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Use the Slideshow mode to cycle through your cities and visualize the weather across different global regions.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(168, 85, 247, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>🌅</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Community Sightings</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Discover beautiful horizon moments shared by others. Upvote your favorites and join the conversation in the comments!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(34, 197, 94, 0.1)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <span style={{ fontSize: '1rem' }}>📤</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>Share Your View</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Post your own photos and video links to the community. Images are automatically optimized for fast global sharing.
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
            "The best view comes after the hardest walk." 
            <br />— SunRise Weather Explorer 🧘‍♀️✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
