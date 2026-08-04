import React, { useState } from 'react';
import { Sparkles, MessageSquare, Compass, Heart } from 'lucide-react';

export default function MatchCelebrationModal({
  isOpen,
  partner,
  currentUser,
  onStartChat,
  onKeepExploring
}) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen || !partner) return null;

  const handleClose = (action) => {
    setIsClosing(true);
    setTimeout(() => {
      action();
      setIsClosing(false);
    }, 240);
  };

  return (
    <div
      className={isClosing ? 'animate-fade-out' : 'animate-fade-in'}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 250,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        color: '#FFFFFF'
      }}
    >
      {/* Decorative Shimmer Sparkles */}
      <div style={{ position: 'relative', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          animation: 'pulse-ring 2s infinite ease-in-out',
          color: '#F59E0B'
        }}>
          <Sparkles size={36} />
        </div>
      </div>

      {/* Main Heading */}
      <h2 style={{
        fontSize: '26px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        background: 'linear-gradient(to right, #CFFAFE, #DBEAFE, #CBD5E1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '10px'
      }}>
        It's a Connection!
      </h2>
      
      <p style={{
        fontSize: '14px',
        color: '#94A3B8',
        maxWidth: '280px',
        lineHeight: '20px',
        marginBottom: '40px'
      }}>
        You and <strong>{partner.name.split(' ')[0]}</strong> have both consented to discover each other nearby.
      </p>

      {/* Side-by-Side Avatars with Pulse Connector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '50px',
        position: 'relative'
      }}>
        {/* Current User Avatar */}
        <div style={{ position: 'relative' }}>
          <img
            src={currentUser.photo}
            alt={currentUser.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FFFFFF',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)'
            }}
          />
          <div className="avatar-visible-pulse" style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid #2563EB'
          }} />
        </div>

        {/* Heart Connector */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#2563EB',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.5)',
          zIndex: 10,
          animation: 'pulse-ring 1.6s infinite ease-in-out'
        }}>
          <Heart size={20} fill="#FFFFFF" />
        </div>

        {/* Partner Avatar */}
        <div style={{ position: 'relative' }}>
          <img
            src={partner.photo}
            alt={partner.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FFFFFF',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)'
            }}
          />
          <div className="avatar-visible-pulse" style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid #2563EB',
            animationDelay: '1s'
          }} />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
        <button
          onClick={() => handleClose(onStartChat)}
          className="btn btn-primary"
          style={{
            padding: '14px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
          }}
        >
          <MessageSquare size={18} />
          Start Secure Chat
        </button>

        <button
          onClick={() => handleClose(onKeepExploring)}
          className="btn btn-secondary"
          style={{
            padding: '12px',
            fontSize: '14px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Compass size={18} />
          Keep Exploring
        </button>
      </div>
    </div>
  );
}
