'use client';
import React, { useState, useEffect } from 'react';

type Sighting = {
  id: number;
  country: string;
  city: string;
  submitted_at: string;
  submitter_name: string;
  caption: string;
  media_url: string;
  media_type: 'image' | 'video';
  approved: boolean;
};

export default function ModerateSightings() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchSightings();
    } else {
      setError('Incorrect password');
    }
  };

  const fetchSightings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sightings/moderate');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSightings(data);
      }
    } catch (err) {
      setError('Failed to fetch sightings');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, approved: boolean) => {
    try {
      const res = await fetch('/api/sightings/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });
      if (res.ok) {
        setSightings(prev => approved 
          ? prev.map(s => s.id === id ? { ...s, approved: true } : s)
          : prev.filter(s => s.id !== id)
        );
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="glass-panel" style={{ maxWidth: '400px', margin: '40px auto', padding: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>Admin Access</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="glass-input"
            style={{ paddingLeft: '16px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem' }}>{error}</p>}
          <button type="submit" className="glass-button active" style={{ width: '100%' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Moderation Queue</h2>
        <button onClick={fetchSightings} className="glass-button" style={{ fontSize: '0.8rem' }}>🔄 Refresh</button>
      </div>

      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <div className="city-grid">
          {sightings.map(s => (
            <div key={s.id} className="glass-panel card-animate" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                {s.media_type === 'image' ? (
                  <img src={s.media_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>🎬 Video</div>
                )}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.city}, {s.country}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By: {s.submitter_name}</p>
                <p style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.8 }}>{s.caption}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                {!s.approved && (
                  <button onClick={() => handleAction(s.id, true)} className="glass-button active" style={{ flex: 1, fontSize: '0.75rem', background: '#22c55e', borderColor: '#22c55e' }}>Approve</button>
                )}
                <button onClick={() => handleAction(s.id, false)} className="glass-button" style={{ flex: 1, fontSize: '0.75rem', color: '#ff4d4d', borderColor: 'rgba(255,77,77,0.2)' }}>Delete</button>
              </div>
            </div>
          ))}
          {sightings.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No sightings found.</p>}
        </div>
      )}
    </div>
  );
}
