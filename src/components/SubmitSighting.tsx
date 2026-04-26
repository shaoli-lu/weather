'use client';
import React, { useState } from 'react';

export default function SubmitSighting({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    submitter_name: '',
    caption: '',
    media_url: '',
    media_type: 'image' as 'image' | 'video'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.media_url) {
      setError('Please provide a media URL');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/sightings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          country: '',
          city: '',
          submitter_name: '',
          caption: '',
          media_url: '',
          media_type: 'image'
        });
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Share Your Horizon 🌅
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-group">
            <label className="detail-label">Country / 国家</label>
            <input
              type="text"
              placeholder="e.g. USA"
              className="glass-input"
              style={{ paddingLeft: '16px' }}
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="detail-label">City / 城市</label>
            <input
              type="text"
              placeholder="e.g. New York"
              className="glass-input"
              style={{ paddingLeft: '16px' }}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="detail-label">Your Name / 您的名字</label>
          <input
            type="text"
            placeholder="Default to Unknown"
            className="glass-input"
            style={{ paddingLeft: '16px' }}
            value={formData.submitter_name}
            onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="detail-label">Media Type / 媒体类型</label>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, media_type: 'image' })}
              className={`glass-button ${formData.media_type === 'image' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >
              📷 Image
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, media_type: 'video' })}
              className={`glass-button ${formData.media_type === 'video' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >
              🎬 Video
            </button>
          </div>
        </div>

        <div className="input-group">
          <label className="detail-label">Media URL / 媒体链接</label>
          <input
            type="text"
            placeholder={formData.media_type === 'image' ? "Paste image URL here..." : "Paste YouTube/Vimeo/Video URL here..."}
            className="glass-input"
            style={{ paddingLeft: '16px' }}
            value={formData.media_url}
            onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label className="detail-label">Caption / 描述 (Optional)</label>
          <textarea
            placeholder="Share the story behind this moment..."
            className="glass-input"
            style={{ 
              paddingLeft: '16px', 
              paddingTop: '12px',
              borderRadius: 'var(--border-radius-md)', 
              minHeight: '100px',
              resize: 'vertical'
            }}
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
          />
        </div>

        {error && (
          <p style={{ color: '#ff4d4d', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="glass-button active"
          style={{ 
            marginTop: '12px', 
            padding: '16px', 
            fontSize: '1rem',
            width: '100%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            color: 'white',
            border: 'none'
          }}
        >
          {submitting ? 'Submitting...' : '🚀 Submit Sighting'}
        </button>
      </form>
    </div>
  );
}
