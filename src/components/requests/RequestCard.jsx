import React, { useState, useRef } from 'react';
import { Clock, ShieldAlert, X, MapPin, Check, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

export default function RequestCard({ request, onAccept, onDecline, onBlock }) {
  const { sender, introMessage, expiresInDays } = request;
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const SWIPE_THRESHOLD = 90;

  // Touch Event Handlers
  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    hasDraggedRef.current = false;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startXRef.current;
    if (Math.abs(diffX) > 5) {
      hasDraggedRef.current = true;
    }
    setSwipeOffset(Math.max(-180, Math.min(180, diffX)));
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (swipeOffset > SWIPE_THRESHOLD) {
      onAccept(request);
    } else if (swipeOffset < -SWIPE_THRESHOLD) {
      onDecline(request);
    } else {
      setSwipeOffset(0);
    }
  };

  // Mouse Drag Event Handlers for Desktop
  const handleMouseDown = (e) => {
    startXRef.current = e.clientX;
    hasDraggedRef.current = false;
    setIsSwiping(true);
  };

  const handleMouseMove = (e) => {
    if (!isSwiping) return;
    const diffX = e.clientX - startXRef.current;
    if (Math.abs(diffX) > 5) {
      hasDraggedRef.current = true;
    }
    setSwipeOffset(Math.max(-180, Math.min(180, diffX)));
  };

  const handleMouseUp = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (swipeOffset > SWIPE_THRESHOLD) {
      onAccept(request);
    } else if (swipeOffset < -SWIPE_THRESHOLD) {
      onDecline(request);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleCardClick = () => {
    // Only toggle expansion if the user pressed/tapped without sliding
    if (!hasDraggedRef.current && Math.abs(swipeOffset) < 10) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: swipeOffset > 0 ? '#DCFCE7' : swipeOffset < 0 ? '#FEE2E2' : '#F1F5F9',
        userSelect: 'none',
        touchAction: 'pan-y'
      }}
    >
      {/* Accept Backdrop Indicator (Right Swipe) */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '50%',
        background: '#22C55E',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '20px',
        gap: '8px',
        fontWeight: 700,
        fontSize: '13px',
        opacity: Math.min(1, Math.max(0, swipeOffset / SWIPE_THRESHOLD))
      }}>
        <Check size={20} strokeWidth={3} />
        <span>ACCEPT</span>
      </div>

      {/* Decline Backdrop Indicator (Left Swipe) */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '50%',
        background: '#EF4444',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '20px',
        gap: '8px',
        fontWeight: 700,
        fontSize: '13px',
        opacity: Math.min(1, Math.max(0, -swipeOffset / SWIPE_THRESHOLD))
      }}>
        <span>DECLINE</span>
        <X size={20} strokeWidth={3} />
      </div>

      {/* Swiping Front Surface Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCardClick}
        className="request-card animate-fade-up"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 200ms ease, background 200ms ease',
          background: 'var(--color-surface)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: '12px 14px',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Main Compact Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <img
              src={sender.photo}
              alt={sender.name}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #DBEAFE',
                flexShrink: 0
              }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: '18px' }}>
                  {sender.name}, {sender.age}
                </h4>

                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: '#CFFAFE',
                  color: '#0891B2',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  flexShrink: 0
                }}>
                  <MapPin size={10} color="#0891B2" />
                  ~{sender.distance}
                </span>
              </div>

              <div style={{
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {introMessage ? `"${introMessage}"` : sender.interests.slice(0, 2).join(' • ')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '11px',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {introMessage && <MessageSquare size={13} color="#2563EB" />}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
        </div>

        {/* Swipe Hint Sub-text */}
        <div style={{
          fontSize: '10px',
          color: '#94A3B8',
          marginTop: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: isExpanded ? 'none' : '1px dashed var(--color-border)',
          paddingTop: isExpanded ? 0 : '4px'
        }}>
          <span>👈 Swipe left to decline</span>
          <span>Tap to expand</span>
          <span>Swipe right to accept 👉</span>
        </div>

        {/* Expandable Intro Message & Actions */}
        {isExpanded && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {introMessage && (
              <div style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
                lineHeight: '16px'
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', marginBottom: '3px' }}>
                  INTRO MESSAGE
                </div>
                "{introMessage}"
              </div>
            )}

            <div style={{ fontSize: '11px', color: '#64748B' }}>
              <strong>Interests:</strong> {sender.interests.join(', ')}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#B45309'
            }}>
              <Clock size={12} color="#B45309" />
              <span>Expires in {expiresInDays} days</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => onAccept(request)}
                className="btn btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '12px' }}
              >
                <Check size={14} /> Accept & Chat
              </button>

              <button
                onClick={() => onDecline(request)}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '12px' }}
              >
                <X size={14} /> Decline
              </button>

              <button
                onClick={() => onBlock(sender)}
                title="Block & Report"
                className="btn btn-danger btn-icon"
                style={{ width: '32px', height: '32px' }}
              >
                <ShieldAlert size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
