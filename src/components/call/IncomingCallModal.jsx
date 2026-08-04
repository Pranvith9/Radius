import React from 'react';
import { Phone, Video } from 'lucide-react';

export default function IncomingCallModal({ caller, callType, onAcceptCall, onDeclineCall }) {
  if (!caller) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 200,
      background: 'rgba(9, 9, 11, 0.92)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '48px 24px 60px 24px',
      color: '#FFFFFF'
    }}>
      {/* Caller Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#A1A1AA', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Incoming {callType === 'video' ? 'Video' : 'Voice'} Call
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: 700, textAlign: 'center' }}>
          {caller.name}
        </h2>
        <span style={{ fontSize: '13px', color: '#D4D4D8' }}>
          Nearby Connection • {caller.distance} away
        </span>
      </div>

      {/* Pulsing Avatar Rings */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pulse-ring-active" style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          position: 'absolute'
        }} />

        <img
          src={caller.photo}
          alt={caller.name}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid #FFFFFF',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 10
          }}
        />
      </div>

      {/* Action Buttons: Accept / Decline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px', zIndex: 10 }}>
        {/* Decline Button (Normal Red Phone Icon) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onDeclineCall}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
              transform: 'rotate(135deg)' // rotated down for hangup
            }}
          >
            <Phone size={28} />
          </button>
          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Decline</span>
        </div>

        {/* Accept Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onAcceptCall}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#22C55E',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)'
            }}
          >
            {callType === 'video' ? <Video size={28} /> : <Phone size={28} />}
          </button>
          <span style={{ fontSize: '12px', color: '#A1A1AA' }}>Accept</span>
        </div>
      </div>
    </div>
  );
}
