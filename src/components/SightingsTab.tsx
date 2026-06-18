'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

type Sighting = {
  id: number;
  country: string;
  city: string;
  submitted_at: string;
  submitter_name: string;
  caption: string;
  media_url: string;
  media_type: 'image' | 'video';
  upvotes: number;
  downvotes: number;
  comment_count: number;
};

type Comment = {
  id: number;
  sighting_id: number;
  author: string;
  content: string;
  created_at: string;
};

// ── Media URL cache ────────────────────────────────────────────────────────────
// Keyed by `${sort}:${page}` so switching tabs doesn't re-fetch already loaded pages.
type PageCache = { data: Sighting[]; hasMore: boolean };
const pageCache = new Map<string, PageCache>();

const PAGE_SIZE = 10;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?/]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?loop=1&playlist=${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?loop=1`;
  return null;
}

// ── Card ──────────────────────────────────────────────────────────────────────
function SightingCard({ s, onVote }: { s: Sighting; onVote: (id: number, dir: 'up' | 'down') => void }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localCount, setLocalCount] = useState(s.comment_count || 0);

  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/sightings/comments?sighting_id=${s.id}`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    } finally {
      setLoadingComments(false);
    }
  }, [s.id]);

  useEffect(() => {
    if (showComments) loadComments();
  }, [showComments, loadComments]);

  const submitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/sightings/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sighting_id: s.id, author: commentAuthor || 'Anonymous', content: newComment.trim() }),
      });
      if (res.ok) {
        const c = await res.json();
        setComments(prev => [...prev, c]);
        setNewComment('');
        setLocalCount(n => n + 1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const score = s.upvotes - s.downvotes;
  const embedUrl = getEmbedUrl(s.media_url);

  return (
    <div className="glass-panel sighting-card card-animate" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Media */}
      <div style={{ position: 'relative', background: 'rgba(0,0,0,0.4)' }}>
        {s.media_type === 'image' ? (
          <img
            src={s.media_url}
            alt={s.caption || 'Sunrise/Sunset'}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', objectPosition: 'center', display: 'block', background: 'rgba(0,0,0,0.6)' }}
            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x400/0a0a1a/00d4ff?text=Image+unavailable'; }}
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={s.caption || 'Video'}
            style={{ width: '100%', height: '280px', border: 'none', display: 'block' }}
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <video
            src={s.media_url}
            controls
            loop
            preload="none"
            style={{ width: '100%', maxHeight: '280px', display: 'block' }}
          />
        )}
        {/* Type badge */}
        <span style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          color: s.media_type === 'image' ? 'var(--accent)' : '#f97316',
          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
          padding: '4px 10px', borderRadius: '999px',
          border: `1px solid ${s.media_type === 'image' ? 'rgba(0,212,255,0.3)' : 'rgba(249,115,22,0.3)'}`,
          textTransform: 'uppercase',
        }}>
          {s.media_type === 'image' ? '📷 Photo' : '🎬 Video'}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px' }}>
        {/* Location & meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                🌅 {s.city}, {s.country}
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
              by <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{s.submitter_name}</span>
              <span style={{ margin: '0 6px', opacity: 0.4 }}>•</span>
              {timeAgo(s.submitted_at)}
            </div>
          </div>
        </div>

        {/* Caption */}
        {s.caption && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0 12px', lineHeight: 1.5 }}>
            {s.caption}
          </p>
        )}

        {/* Actions bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Vote */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '4px 6px' }}>
            <button onClick={() => onVote(s.id, 'up')} className="vote-btn up" title="Upvote">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l8 8H4z"/></svg>
            </button>
            <span style={{
              fontSize: '0.85rem', fontWeight: 700, minWidth: 28, textAlign: 'center',
              color: score > 0 ? '#22c55e' : score < 0 ? '#ef4444' : 'var(--text-secondary)',
            }}>{score}</span>
            <button onClick={() => onVote(s.id, 'down')} className="vote-btn down" title="Downvote">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20l-8-8h16z"/></svg>
            </button>
          </div>

          {/* Comments toggle */}
          <button
            onClick={() => setShowComments(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: showComments ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showComments ? 'rgba(0,212,255,0.2)' : 'transparent'}`,
              color: showComments ? 'var(--accent)' : 'var(--text-secondary)',
              borderRadius: '999px', padding: '5px 12px',
              cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              transition: 'all 0.2s ease', fontFamily: 'inherit',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {localCount} {localCount === 1 ? 'comment' : 'comments'}
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
            {loadingComments ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div className="loading-spinner" style={{ width: 24, height: 24, margin: '0 auto', borderWidth: 2 }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {comments.length === 0 && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
                    No comments yet — be the first! 🌅
                  </p>
                )}
                {comments.map(c => (
                  <div key={c.id} style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 12,
                    padding: '10px 14px', border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)' }}>{c.author}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{timeAgo(c.created_at)}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={commentAuthor}
                  onChange={e => setCommentAuthor(e.target.value)}
                  className="glass-input"
                  style={{ flex: '0 0 140px', padding: '8px 14px', fontSize: '0.78rem' }}
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitComment()}
                  className="glass-input"
                  style={{ flex: 1, padding: '8px 14px', fontSize: '0.78rem' }}
                />
                <button
                  onClick={submitComment}
                  disabled={submitting || !newComment.trim()}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.15))',
                    border: '1px solid rgba(0,212,255,0.25)',
                    color: 'var(--accent)', borderRadius: '999px',
                    padding: '8px 16px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                    fontFamily: 'inherit', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                    opacity: submitting || !newComment.trim() ? 0.5 : 1,
                  }}
                >
                  {submitting ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main SightingsTab ─────────────────────────────────────────────────────────
export default function SightingsTab() {
  const [subTab, setSubTab] = useState<'hot' | 'new' | 'top'>('new');
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Track which (sort, page) combos are already in-flight to avoid duplicate fetches
  const inFlightRef = useRef(new Set<string>());

  const fetchPage = useCallback(async (sort: string, pageNum: number, replace: boolean) => {
    const cacheKey = `${sort}:${pageNum}`;

    // Return from cache if available
    if (pageCache.has(cacheKey)) {
      const cached = pageCache.get(cacheKey)!;
      if (replace) {
        setSightings(cached.data);
      } else {
        setSightings(prev => [...prev, ...cached.data]);
      }
      setHasMore(cached.hasMore);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    // Deduplicate in-flight requests
    if (inFlightRef.current.has(cacheKey)) return;
    inFlightRef.current.add(cacheKey);

    try {
      const res = await fetch(`/api/sightings?sort=${sort}&page=${pageNum}&limit=${PAGE_SIZE}`);
      const json = await res.json();
      const items: Sighting[] = Array.isArray(json.data) ? json.data : [];
      const more: boolean = !!json.hasMore;

      // Store in cache
      pageCache.set(cacheKey, { data: items, hasMore: more });

      if (replace) {
        setSightings(items);
      } else {
        setSightings(prev => [...prev, ...items]);
      }
      setHasMore(more);
    } finally {
      inFlightRef.current.delete(cacheKey);
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // When tab changes reset to page 0
  useEffect(() => {
    setLoading(true);
    setPage(0);
    setHasMore(false);
    fetchPage(subTab, 0, true);
  }, [subTab, fetchPage]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchPage(subTab, nextPage, false);
  };

  const handleVote = async (id: number, dir: 'up' | 'down') => {
    const res = await fetch('/api/sightings/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sighting_id: id, direction: dir }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSightings(prev => prev.map(s => s.id === id ? { ...s, upvotes: updated.upvotes, downvotes: updated.downvotes } : s));
    }
  };

  const subTabs = [
    { id: 'new', label: '✨ New', desc: 'Latest submissions' },
    { id: 'hot', label: '🔥 Hot', desc: 'Most popular' },
    { id: 'top', label: '🏆 Top', desc: 'All-time best' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
      {/* Sub-tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, justifyContent: 'center' }}>
        {subTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`glass-button ${subTab === t.id ? 'active' : ''}`}
            style={{ fontSize: '0.82rem' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0' }}>
          <div className="loading-spinner" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 16, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Loading sightings…
          </p>
        </div>
      ) : sightings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: 'rgba(255,255,255,0.02)', borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🌅</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            No sightings yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Be the first to share a beautiful sunrise or sunset!
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sightings.map((s, i) => (
              <div key={s.id} style={{ animationDelay: `${i * 0.06}s` }}>
                <SightingCard s={s} onVote={handleVote} />
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(168,85,247,0.10))',
                  border: '1px solid rgba(0,212,255,0.25)',
                  color: 'var(--accent)',
                  borderRadius: '999px',
                  padding: '12px 32px',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem', fontWeight: 700,
                  fontFamily: 'inherit',
                  letterSpacing: '0.05em',
                  transition: 'all 0.25s ease',
                  opacity: loadingMore ? 0.7 : 1,
                  boxShadow: '0 0 20px rgba(0,212,255,0.08)',
                }}
                onMouseEnter={e => {
                  if (!loadingMore) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(0,212,255,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.08)';
                }}
              >
                {loadingMore ? (
                  <>
                    <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Loading…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12l7 7 7-7"/>
                    </svg>
                    Load More
                  </>
                )}
              </button>
            </div>
          )}

          {/* End-of-feed indicator */}
          {!hasMore && sightings.length >= PAGE_SIZE && (
            <div style={{ textAlign: 'center', padding: '24px 0 8px', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              ✦ You&apos;ve seen them all ✦
            </div>
          )}
        </>
      )}
    </div>
  );
}
