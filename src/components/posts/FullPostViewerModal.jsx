import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Heart, MessageCircle, Share2, Play, MapPin, Check, 
  User, ChevronUp, ChevronDown, Send, CornerDownRight 
} from 'lucide-react';

export default function FullPostViewerModal({
  posts,
  initialPostId,
  onClose,
  onLikePost,
  onSelectPerson
}) {
  const initialIndex = Math.max(0, posts.findIndex((p) => p.id === initialPostId));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [commentsState, setCommentsState] = useState({});
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [shareToast, setShareToast] = useState(false);

  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  // Auto-scroll to initial post index on mount
  useEffect(() => {
    if (itemRefs.current[initialIndex]) {
      itemRefs.current[initialIndex].scrollIntoView({ behavior: 'auto' });
    }
  }, [initialIndex]);

  // Track active post on scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    if (height > 0) {
      const index = Math.round(scrollTop / height);
      if (index >= 0 && index < posts.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  // Keyboard navigation (Up/Down arrows, ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        scrollToPost(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        scrollToPost(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, posts.length]);

  const scrollToPost = (index) => {
    if (index >= 0 && index < posts.length && itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({ behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  const activePost = posts[activeIndex] || posts[0];

  // Helper for adding comment
  const handleAddComment = (postId) => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: `comment_${Date.now()}`,
      authorName: 'Alex',
      text: commentInput.trim(),
      time: 'Just now'
    };

    setCommentsState((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || getInitialComments(postId)), newComment]
    }));

    setCommentInput('');
  };

  const getInitialComments = (postId) => {
    return [
      { id: 'c1', authorName: 'Marcus', text: 'This looks super cool! 🔥', time: '10m ago' },
      { id: 'c2', authorName: 'Elena', text: 'Love the vibe! Where is this located?', time: '25m ago' }
    ];
  };

  const currentPostComments = activePost ? (commentsState[activePost.id] || getInitialComments(activePost.id)) : [];

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 1000,
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none'
    }}>
      {/* Top Header Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <X size={22} />
        </button>

        {/* Feed Indicator Pill */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '6px 16px',
          borderRadius: '9999px',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{activePost?.type === 'short' ? '🎥 Video Short' : '🖼️ Photo Post'}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>•</span>
          <span style={{ color: '#38BDF8' }}>{activeIndex + 1} of {posts.length}</span>
        </div>

        {/* Placeholder for layout balance */}
        <div style={{ width: '40px' }} />
      </div>

      {/* Vertical Scroll Snap Feed */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {posts.map((post, index) => {
          const { author } = post;
          const isCurrent = index === activeIndex;

          return (
            <div
              key={post.id}
              ref={(el) => (itemRefs.current[index] = el)}
              style={{
                width: '100%',
                height: '100%',
                scrollSnapAlign: 'start',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0B0F17',
                overflow: 'hidden'
              }}
            >
              {/* Main Media Background (Full Screen) */}
              <img
                src={post.mediaUrl}
                alt={post.caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.92)'
                }}
              />

              {/* Play Badge for Video Shorts */}
              {post.type === 'short' && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  opacity: 0.85
                }}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(37, 99, 235, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    paddingLeft: '6px'
                  }}>
                    <Play size={36} fill="#FFFFFF" />
                  </div>
                </div>
              )}

              {/* Bottom Gradient for Text Readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 75%)',
                pointerEvents: 'none'
              }} />

              {/* Right Side Action Sidebar (Reels / TikTok Style) */}
              <div style={{
                position: 'absolute',
                right: '16px',
                bottom: '100px',
                zIndex: 1050,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                {/* Author Avatar Button */}
                <div
                  onClick={() => {
                    onClose();
                    onSelectPerson(author);
                  }}
                  style={{
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={author.photo}
                    alt={author.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #2563EB',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }}>
                    <User size={11} />
                  </div>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => onLikePost(post.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: post.isLiked ? '#EF4444' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'transform 150ms ease',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                  }}
                >
                  <Heart size={24} fill={post.isLiked ? '#EF4444' : 'none'} color={post.isLiked ? '#EF4444' : '#FFFFFF'} />
                </button>
                <span style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, marginTop: '-14px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {post.likesCount}
                </span>

                {/* Comment Button */}
                <button
                  onClick={() => setShowCommentsModal(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                  }}
                >
                  <MessageCircle size={22} />
                </button>
                <span style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, marginTop: '-14px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {(commentsState[post.id] || getInitialComments(post.id)).length + (post.commentsCount || 0)}
                </span>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                  }}
                >
                  <Share2 size={22} />
                </button>

                {/* Up/Down Scroll Navigation Arrows (Web/Desktop convenience) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  <button
                    disabled={index === 0}
                    onClick={() => scrollToPost(index - 1)}
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: index === 0 ? 0.3 : 1,
                      cursor: index === 0 ? 'default' : 'pointer'
                    }}
                  >
                    <ChevronUp size={18} />
                  </button>

                  <button
                    disabled={index === posts.length - 1}
                    onClick={() => scrollToPost(index + 1)}
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: index === posts.length - 1 ? 0.3 : 1,
                      cursor: index === posts.length - 1 ? 'default' : 'pointer'
                    }}
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>

              {/* Bottom Post Metadata & Author Information Overlay */}
              <div style={{
                position: 'absolute',
                left: '20px',
                bottom: '30px',
                right: '80px',
                zIndex: 1050,
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {/* Author Info Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    onClick={() => {
                      onClose();
                      onSelectPerson(author);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                      {author.name}, {author.age}
                    </h3>
                    {author.isVerified && (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <span className="distance-pill" style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(37, 99, 235, 0.85)', color: '#FFFFFF', border: 'none' }}>
                    <MapPin size={10} />
                    ~{author.distance}
                  </span>
                </div>

                {/* Caption */}
                <p style={{
                  fontSize: '14px',
                  color: '#F8FAFC',
                  lineHeight: '20px',
                  textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                  maxHeight: '80px',
                  overflowY: 'auto'
                }}>
                  {post.caption}
                </p>

                {/* Tag & Timestamp */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                  {post.tag && (
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      #{post.tag}
                    </span>
                  )}
                  <span style={{ fontSize: '12px', color: '#CBD5E1' }}>{post.createdAt}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Toast Notification */}
      {shareToast && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1200,
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#FFFFFF',
          padding: '10px 20px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Share2 size={16} color="#38BDF8" />
          Post link copied to clipboard!
        </div>
      )}

      {/* Comments Drawer / Bottom Sheet */}
      {showCommentsModal && activePost && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1200,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
        onClick={() => setShowCommentsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-surface)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px',
              maxHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
              animation: 'slide-up 200ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Comments Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Comments ({currentPostComments.length})
              </h3>
              <button
                onClick={() => setShowCommentsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '150px' }}>
              {currentPostComments.map((c) => (
                <div key={c.id} style={{ display: 'flex', gap: '10px', background: 'var(--color-bg)', padding: '10px 12px', borderRadius: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                    {c.authorName[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{c.authorName}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{c.time}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input Box */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment(activePost.id);
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '9999px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleAddComment(activePost.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '9999px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
