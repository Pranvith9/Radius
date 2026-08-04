import React, { useState } from 'react';
import { MapPin, ShieldAlert, EyeOff, Eye, Sparkles, Navigation, X, MessageCircle, Check, MessageSquare } from 'lucide-react';

export default function MapView({
  users = [],
  currentUser,
  panicActive,
  onToggleVisibility,
  onSelectPerson,
  onConnectPerson,
  pendingRequestUserIds = [],
  connectedUserIds = [],
  onOpenChat
}) {
  const [selectedPin, setSelectedPin] = useState(null);

  // Default fallback coordinates if missing
  const defaultCoords = [
    { x: 35, y: 38 },
    { x: 64, y: 28 },
    { x: 28, y: 62 },
    { x: 72, y: 68 },
    { x: 48, y: 78 }
  ];

  // If Discoverability is OFF or Panic Active
  if (!currentUser?.visibility || panicActive) {
    return (
      <div style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 24px',
        textAlign: 'center',
        background: 'var(--color-bg)',
        color: 'var(--color-text-primary)'
      }}>
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          background: panicActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(37, 99, 235, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: panicActive ? '#EF4444' : '#2563EB',
          marginBottom: '20px',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.15)'
        }}>
          {panicActive ? <ShieldAlert size={42} /> : <EyeOff size={42} />}
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          {panicActive ? 'Panic Pause Mode Active' : 'Hidden Mode Active'}
        </h3>

        <p style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          lineHeight: '22px',
          maxWidth: '300px',
          marginBottom: '24px'
        }}>
          {panicActive
            ? 'Your profile and location are currently paused for privacy.'
            : 'You are in Hidden Mode. Turn ON visibility to discover nearby people on the map.'}
        </p>

        {!panicActive && (
          <button
            onClick={onToggleVisibility}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Eye size={18} />
            Turn ON Visibility & View Map
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'var(--color-bg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Map Header Notice */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 20,
        background: 'var(--color-surface)',
        backdropFilter: 'blur(8px)',
        padding: '8px 14px',
        borderRadius: '9999px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: 'var(--color-text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} color="#2563EB" />
          <span><strong>Privacy Coarse Pins:</strong> Location is fuzzed for safety</span>
        </div>
      </div>

      {/* Interactive Map Canvas Grid */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--color-bg)'
      }}>
        {/* Radar Ring Center */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <div className="sync-pulse-active" style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            border: '2px solid rgba(37, 99, 235, 0.4)',
            background: 'rgba(37, 99, 235, 0.1)'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#2563EB',
            border: '3px solid var(--color-surface)',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
          }} />
        </div>

        {/* Coarse Fuzzed Pins */}
        {users.map((user, idx) => {
          const coords = user.coords || defaultCoords[idx % defaultCoords.length];
          const isSelected = selectedPin?.id === user.id;
          const isConnected = connectedUserIds.includes(user.id);

          return (
            <div
              key={user.id}
              onClick={() => setSelectedPin(user)}
              style={{
                position: 'absolute',
                top: `${coords.y}%`,
                left: `${coords.x}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isSelected ? 30 : 10
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px 4px 4px',
                borderRadius: '9999px',
                background: isSelected ? '#2563EB' : isConnected ? 'rgba(34, 197, 94, 0.2)' : 'var(--color-surface)',
                color: isSelected ? '#FFFFFF' : isConnected ? '#22C55E' : 'var(--color-text-primary)',
                boxShadow: isSelected ? '0 6px 20px rgba(37, 99, 235, 0.4)' : '0 2px 8px rgba(0,0,0,0.18)',
                border: isSelected ? '2px solid #FFFFFF' : isConnected ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid var(--color-border)',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 200ms ease'
              }}>
                <img
                  src={user.photo}
                  alt={user.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, lineHeight: '14px' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>
                    ~{user.distance}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Map Pin Preview Sheet */}
      {selectedPin && (
        <div className="animate-fade-up neptune-gradient-shell" style={{
          position: 'absolute',
          bottom: '16px',
          left: '12px',
          right: '12px',
          zIndex: 40
        }}>
          <div className="neptune-gradient-shell-inner" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={selectedPin.photo}
                  alt={selectedPin.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563EB' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '17px', fontWeight: 700 }}>
                      {selectedPin.name}, {selectedPin.age}
                    </h4>
                    {selectedPin.isVerified && (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className="distance-pill" style={{ marginTop: '4px' }}>
                    <MapPin size={11} />
                    ~{selectedPin.distance} away
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPin(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '18px' }}>
              {selectedPin.bio}
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  onSelectPerson(selectedPin);
                  setSelectedPin(null);
                }}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px' }}
              >
                Profile
              </button>

              {connectedUserIds.includes(selectedPin.id) ? (
                <button
                  onClick={() => {
                    onOpenChat(selectedPin);
                    setSelectedPin(null);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  <MessageSquare size={15} />
                  Open Chat
                </button>
              ) : (
                <button
                  onClick={() => {
                    onConnectPerson(selectedPin);
                    setSelectedPin(null);
                  }}
                  disabled={pendingRequestUserIds.includes(selectedPin.id)}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  <MessageCircle size={15} />
                  {pendingRequestUserIds.includes(selectedPin.id) ? 'Pending' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
