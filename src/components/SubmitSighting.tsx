'use client';
import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase';

export default function SubmitSighting({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    submitter_name: '',
    caption: '',
    media_url: '',
    media_type: 'video' as 'image' | 'video'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.media_type === 'image' && !selectedFile) {
      setError('Please select an image file to upload');
      return;
    }
    
    if (formData.media_type === 'video' && !formData.media_url) {
      setError('Please provide a video URL');
      return;
    }

    setError('');
    setSubmitting(true);
    setUploadProgress(10);

    try {
      let finalMediaUrl = formData.media_url;

      // Handle Image Upload with Compression
      if (formData.media_type === 'image' && selectedFile) {
        setUploadProgress(20);
        
        // 1. Compress Image
        const options = {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(selectedFile, options);
        setUploadProgress(40);

        // 2. Upload to Supabase Storage
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('sightings')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('sightings')
          .getPublicUrl(filePath);
        
        finalMediaUrl = publicUrl;
        setUploadProgress(80);
      }

      // Submit to DB
      const res = await fetch('/api/sightings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, media_url: finalMediaUrl }),
      });

      if (res.ok) {
        setUploadProgress(100);
        setFormData({
          country: '',
          city: '',
          submitter_name: '',
          caption: '',
          media_url: '',
          media_type: 'video'
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please ensure the "sightings" storage bucket exists and is public.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
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
              onClick={() => setFormData({ ...formData, media_type: 'video' })}
              className={`glass-button ${formData.media_type === 'video' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >
              🎬 Video Link
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, media_type: 'image' })}
              className={`glass-button ${formData.media_type === 'image' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >
              📷 Upload Image
            </button>
          </div>
        </div>

        <div className="input-group">
          {formData.media_type === 'image' ? (
            <>
              <label className="detail-label">Select Image / 选择图片</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="glass-input" 
                  style={{ 
                    display: 'block', 
                    padding: '12px 16px', 
                    cursor: 'pointer',
                    color: selectedFile ? 'var(--accent)' : 'var(--text-muted)',
                    textAlign: 'center',
                    borderStyle: 'dashed'
                  }}
                >
                  {selectedFile ? `✅ ${selectedFile.name}` : '📁 Click to choose an image...'}
                </label>
              </div>
            </>
          ) : (
            <>
              <label className="detail-label">Video URL / 视频链接</label>
              <input
                type="text"
                placeholder="Paste YouTube/Vimeo/Video URL here..."
                className="glass-input"
                style={{ paddingLeft: '16px' }}
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
              />
            </>
          )}
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

        {submitting && uploadProgress > 0 && (
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
          </div>
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
            border: 'none',
            opacity: submitting ? 0.7 : 1
          }}
        >
          {submitting ? 'Processing...' : '🚀 Submit Sighting'}
        </button>
      </form>
    </div>
  );
}
