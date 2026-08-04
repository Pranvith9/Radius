import React from 'react';
import { MapPin, Check, MessageCircle, Sparkles, MessageSquare } from 'lucide-react';

export default function PersonCard({
  person,
  user,
  onConnect,
  onConnectPerson,
  onSelectPerson,
  hasPendingRequest,
  isConnected,
  onOpenChat,
  compact = false
}) {
  const targetPerson = person || user;
  const handleConnect = onConnect || onConnectPerson;

  if (!targetPerson) return null;

  return (
    <div
      onClick={() => onSelectPerson && onSelectPerson(targetPerson)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: '20px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 180ms ease, box-shadow 180ms ease'
      }}
    >
      {/* Photo Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: compact ? '180px' : '230px',
        overflow: 'hidden',
        background: 'var(--color-bg)'
      }}>
        <img
          src={targetPerson.photo}
          alt={targetPerson.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.1) 60%, rgba(0,0,0,0) 100%)'
        }} />

        {/* Distance & Presence Pills */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div className="distance-pill" style={{ fontSize: compact ? '11px' : '12px', padding: '3px 9px' }}>
            <MapPin size={compact ? 10 : 12} color="#FFFFFF" />
            <span>{targetPerson.distance}</span>
          </div>

          {targetPerson.activeNow && (
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '9999px',
              background: '#DCFCE7',
              color: '#15803D'
            }}>
              Active
            </span>
          )}
        </div>

        {/* Details Overlay on Image */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '12px',
          right: '12px',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ fontSize: compact ? '16px' : '19px', fontWeight: 700, lineHeight: '22px' }}>
              {targetPerson.name ? targetPerson.name.split(' ')[0] : 'User'}, {targetPerson.age}
            </h3>
            {targetPerson.isVerified && (
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#2563EB',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF'
              }}>
                <Check size={10} strokeWidth={3} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{
        padding: compact ? '10px 12px 12px 12px' : '14px 16px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        gap: '10px'
      }}>
        {/* Icebreaker / Bio Snippet */}
        {!compact && targetPerson.icebreaker ? (
          <div style={{
            background: 'var(--color-bg)',
            padding: '8px 10px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px'
          }}>
            <Sparkles size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              "{targetPerson.icebreaker}"
            </span>
          </div>
        ) : null}

        {/* Shared Interests */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {targetPerson.interests && targetPerson.interests.slice(0, compact ? 2 : 3).map((interest, i) => (
            <span key={i} className="chip" style={{ fontSize: compact ? '11px' : '12px', padding: '3px 8px' }}>
              {interest}
            </span>
          ))}
        </div>

        {/* Action Button: Open Chat if connected vs Request Pending vs Connect */}
        {isConnected ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenChat) onOpenChat(targetPerson);
            }}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: compact ? '8px 12px' : '10px 16px',
              fontSize: compact ? '13px' : '14px',
              marginTop: 'auto',
              borderRadius: '14px'
            }}
          >
            <MessageSquare size={compact ? 14 : 16} />
            Open Chat
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (handleConnect) handleConnect(targetPerson);
            }}
            disabled={hasPendingRequest}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: compact ? '8px 12px' : '10px 16px',
              fontSize: compact ? '13px' : '14px',
              marginTop: 'auto',
              borderRadius: '14px',
              background: hasPendingRequest ? 'var(--color-bg)' : '#2563EB',
              color: hasPendingRequest ? 'var(--color-text-muted)' : '#FFFFFF',
              border: hasPendingRequest ? '1px solid var(--color-border)' : 'none'
            }}
          >
            <MessageCircle size={compact ? 14 : 16} />
            {hasPendingRequest ? 'Request Pending' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
}
