import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Play, Plus, MapPin, Check, Video, Image, User } from 'lucide-react';

export default function ShortsAndPostsFeed({
  posts,
  onLikePost,
  onSelectPerson,
  onOpenCreatePost
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'short' | 'photo'

  const filteredPosts = posts.filter((p) => {
    if (filterType === 'short') return p.type === 'short';
    if (filterType === 'photo') return p.type === 'photo';
    return true;
  });

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: 'var(--neptune-bg-warm)'
    }}>
      {/* Header & Create Post Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--color-surface)',
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Nearby Public Feed & Shorts
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Public moments and video shorts from nearby people
          </p>
        </div>

        <button
          onClick={onOpenCreatePost}
          className="btn btn-primary"
          style={{ padding: '8px 14px', fontSize: '13px' }}
        >
          <Plus size={16} />
          Create
        </button>
      </div>

      {/* Filter Switcher Pills */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[
          { id: 'all', label: 'All Feed' },
          { id: 'short', label: '🎥 Shorts' },
          { id: 'photo', label: '🖼️ Photos' }
        ].map((item) => {
          const isActive = filterType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                background: isActive ? '#2563EB' : 'var(--color-surface)',
                color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: isActive ? '1px solid #2563EB' : '1px solid var(--color-border)',
                transition: 'all 150ms ease'
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Posts & Shorts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredPosts.map((post) => {
          const { author } = post;

          return (
            <div key={post.id} className="neptune-gradient-shell">
              <div className="neptune-gradient-shell-inner" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Author Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    onClick={() => onSelectPerson(author)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  >
                    <img
                      src={author.photo}
                      alt={author.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563EB' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          {author.name}, {author.age}
                        </h4>
                        {author.isVerified && (
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span className="distance-pill" style={{ fontSize: '11px', padding: '2px 6px' }}>
                          <MapPin size={10} />
                          ~{author.distance}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Action Button */}
                  <button
                    onClick={() => onSelectPerson(author)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <User size={13} color="#2563EB" />
                    Profile
                  </button>
                </div>

                {/* Media Container (Video Short vs Photo) */}
                <div
                  onClick={() => onSelectPerson(author)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: post.type === 'short' ? '320px' : '240px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: '#CBD5E1',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Play Overlay for Video Shorts */}
                  {post.type === 'short' && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(15, 23, 42, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        paddingLeft: '4px'
                      }}>
                        <Play size={26} fill="#2563EB" />
                      </div>

                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Video size={12} color="#38BDF8" />
                        Video Short
                      </span>
                    </div>
                  )}

                  {/* Tag Pill */}
                  {post.tag && (
                    <span style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      color: '#0F172A',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      #{post.tag}
                    </span>
                  )}
                </div>

                {/* Caption */}
                <p style={{ fontSize: '14px', color: '#0F172A', lineHeight: '20px' }}>
                  {post.caption}
                </p>

                {/* Interaction Footer: Likes, Comments, Share */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid #F1F5F9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Like Button */}
                    <button
                      onClick={() => onLikePost(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        color: post.isLiked ? '#EF4444' : '#64748B',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={18} fill={post.isLiked ? '#EF4444' : 'none'} color={post.isLiked ? '#EF4444' : 'currentColor'} />
                      <span>{post.likesCount}</span>
                    </button>

                    {/* Comment Counter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', fontWeight: 500 }}>
                      <MessageCircle size={18} />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>

                  <button style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
