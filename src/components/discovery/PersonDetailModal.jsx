import React, { useState } from 'react';
import { X, MapPin, Check, Sparkles, MessageCircle, ShieldAlert, CheckCircle, User } from 'lucide-react';

export default function PersonDetailModal({
  person,
  onClose,
  onConnect,
  onBlock,
  hasPendingRequest,
  isConnected,
  currentUserId = 'usr_000'
}) {
  const [isClosing, setIsClosing] = useState(false);

  if (!person) return null;
  const isSelf = person.id === currentUserId || person.id === 'usr_000';

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240);
  };

  return (
    <div
      onClick={handleClose}
      className={isClosing ? 'animate-fade-out' : 'animate-fade-in'}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 140,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <div
        className={isClosing ? 'animate-slide-down' : 'animate-slide-up'}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxHeight: '92%',
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative',
          cursor: 'default'
        }}
      >
        {/* Top Image Banner */}
        <div style={{ position: 'relative', width: '100%', height: '320px', background: '#CBD5E1' }}>
          <img
            src={person.photo}
            alt={person.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
          >
            <X size={20} />
          </button>

          {!isSelf ? (
            <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
              <span className="distance-pill" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}>
                <MapPin size={12} />
                ~{person.distance || 'Nearby'} away
              </span>
            </div>
          ) : (
            <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: '#DBEAFE',
                color: '#1E40AF',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <User size={12} />
                Your Own Profile
              </span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {person.name}, {person.age}
              </h2>
              {person.isVerified && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>

            {!isSelf && (
              <button
                onClick={() => onBlock(person)}
                title="Report or Block"
                style={{
                  background: '#FEF2F2',
                  color: '#EF4444',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ShieldAlert size={18} />
              </button>
            )}
          </div>

          {/* Icebreaker Prompt Box */}
          {person.icebreaker && (
            <div style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '12px',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <Sparkles size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563EB' }}>Icebreaker Prompt</strong>
                <div style={{ fontSize: '14px', color: 'var(--color-text-primary)', marginTop: '2px' }}>"{person.icebreaker}"</div>
              </div>
            </div>
          )}

          {/* Bio */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>ABOUT</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: '22px', marginTop: '4px' }}>
              {person.bio}
            </p>
          </div>

          {/* Shared Interests */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>INTERESTS</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {person.interests.map((interest, idx) => (
                <span key={idx} className="chip">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Connection Status / CTA */}
          {isSelf ? (
            <button
              onClick={handleClose}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
            >
              Done Viewing Profile
            </button>
          ) : isConnected ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '9999px',
              background: '#DCFCE7',
              color: '#15803D',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid rgba(34, 197, 94, 0.4)',
              marginTop: '4px'
            }}>
              <CheckCircle size={16} />
              Connected • Mutual Chat Active
            </div>
          ) : (
            <button
              onClick={() => onConnect(person)}
              disabled={hasPendingRequest}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
            >
              <MessageCircle size={18} />
              {hasPendingRequest ? 'Request Pending' : `Connect with ${person.name.split(' ')[0]}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
