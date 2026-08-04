import React, { useState, useRef } from 'react';
import { Clock, ShieldAlert, X, MapPin, Check, ChevronDown, ChevronUp, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function RequestCard({ request, onAccept, onDecline, onBlock, onOpenChat }) {
  const { sender, introMessage, expiresInDays, status = 'pending' } = request;
  const isAccepted = status === 'accepted';

  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const SWIPE_THRESHOLD = 90;

  // Touch Event Handlers
  const handleTouchStart = (e) => {
    if (isAccepted) return;
    startXRef.current = e.touches[0].clientX;
    hasDraggedRef.current = false;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping || isAccepted) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startXRef.current;
    if (Math.abs(diffX) > 5) {
      hasDraggedRef.current = true;
    }
    setSwipeOffset(Math.max(-180, Math.min(180, diffX)));
  };

  const handleTouchEnd = () => {
    if (!isSwiping || isAccepted) return;
    setIsSwiping(false);
    if (swipeOffset > SWIPE_THRESHOLD) {
      onAccept(request);
      setSwipeOffset(0);
    } else if (swipeOffset < -SWIPE_THRESHOLD) {
      onDecline(request);
      setSwipeOffset(0);
    } else {
      setSwipeOffset(0);
    }
  };

  // Mouse Drag Event Handlers for Desktop
  const handleMouseDown = (e) => {
    if (isAccepted) return;
    startXRef.current = e.clientX;
    hasDraggedRef.current = false;
    setIsSwiping(true);
  };

  const handleMouseMove = (e) => {
    if (!isSwiping || isAccepted) return;
    const diffX = e.clientX - startXRef.current;
    if (Math.abs(diffX) > 5) {
      hasDraggedRef.current = true;
    }
    setSwipeOffset(Math.max(-180, Math.min(180, diffX)));
  };

  const handleMouseUp = () => {
    if (!isSwiping || isAccepted) return;
    setIsSwiping(false);
    if (swipeOffset > SWIPE_THRESHOLD) {
      onAccept(request);
      setSwipeOffset(0);
    } else if (swipeOffset < -SWIPE_THRESHOLD) {
      onDecline(request);
      setSwipeOffset(0);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleCardClick = () => {
    if (!hasDraggedRef.current && Math.abs(swipeOffset) < 10) {
      setIsExpanded((prev) => !prev);
    }
  };

  // IF ACCEPTED: Render accepted state with Chat Now button below
  if (isAccepted) {
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '16px',
          border: '1.5px solid #10B981',
          borderLeft: '5px solid #10B981',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <img
              src={sender.photo}
              alt={sender.name}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #10B981',
                flexShrink: 0
              }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {sender.name}, {sender.age}
                </h4>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#DCFCE7',
                  color: '#15803D',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <CheckCircle2 size={11} color="#15803D" /> Accepted
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Connected! Consent granted to message & call.
              </p>
            </div>
          </div>
        </div>

        {/* Intro Message Preview */}
        {introMessage && (
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: '8px',
            padding: '8px 10px',
            fontSize: '12px',
            color: 'var(--color-text-primary)',
            fontStyle: 'italic'
          }}>
            "{introMessage}"
          </div>
        )}

        {/* CHAT NOW BUTTON BELOW ON THE CARD */}
        <button
          onClick={() => onOpenChat && onOpenChat(sender)}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: '#2563EB',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            borderRadius: '12px',
            marginTop: '2px'
          }}
        >
          <MessageSquare size={16} />
          <span>Chat Now</span>
        </button>
      </div>
    );
  }

  // PENDING REQUEST CARD WITH SWIPE TO ACCEPT / DECLINE
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
        className="request-card"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 200ms ease, background 200ms ease',
          background: 'var(--color-surface)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-primary)',
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
                <Check size={14} /> Accept Request
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
