import React, { useState, useEffect } from 'react';
import { Phone, Mic, MicOff, Video, VideoOff, RefreshCw, ShieldAlert, Lock } from 'lucide-react';

export default function CallScreen({ partner, callType, onEndCall, onBlockUser }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const [durationSeconds, setDurationSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 180,
      background: '#09090B',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 20px 40px 20px',
      color: '#FFFFFF'
    }}>
      {/* Top Bar: Connection Info & Safety */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(8px)',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Lock size={12} color="#22C55E" />
          <span>WebRTC Encrypted P2P</span>
        </div>

        <button
          onClick={() => onBlockUser(partner)}
          title="Report / Block mid-call"
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#EF4444',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '9999px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <ShieldAlert size={14} />
          Report
        </button>
      </div>

      {/* Main Call Surface View */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        position: 'relative'
      }}>
        {isVideoOn ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            overflow: 'hidden',
            background: '#18181B',
            border: '1px solid #27272A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Remote Partner Video */}
            <img
              src={partner.photo}
              alt={partner.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9)'
              }}
            />

            {/* Self Video PIP Preview */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '90px',
              height: '130px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid #FFFFFF',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              background: '#27272A'
            }}>
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600"
                alt="Self"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Overlay Timer */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '13px'
            }}>
              <div style={{ fontWeight: 700 }}>{partner.name}</div>
              <div style={{ fontSize: '11px', color: '#A1A1AA' }}>{formatTimer(durationSeconds)}</div>
            </div>
          </div>
        ) : (
          /* Voice Call Avatar Display */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              border: '3px solid #2563EB'
            }}>
              <img
                src={partner.photo}
                alt={partner.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700 }}>{partner.name}</h2>
              <div style={{ fontSize: '14px', color: '#22C55E', fontWeight: 600, marginTop: '4px' }}>
                In Call • {formatTimer(durationSeconds)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        zIndex: 20
      }}>
        {/* Mute Audio */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: isMuted ? '#EF4444' : 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)'
          }}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: !isVideoOn ? 'rgba(255,255,255,0.15)' : '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)'
          }}
        >
          {!isVideoOn ? <VideoOff size={22} /> : <Video size={22} />}
        </button>

        {/* Normal Red Hangup Button (Phone icon rotated 135deg) */}
        <button
          onClick={() => onEndCall(durationSeconds)}
          title="End Call"
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
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.5)',
            transform: 'rotate(135deg)'
          }}
        >
          <Phone size={28} />
        </button>

        {/* Flip Camera */}
        <button
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)'
          }}
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
}
