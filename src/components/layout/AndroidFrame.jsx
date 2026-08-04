import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

export default function AndroidFrame({ children, theme = 'light' }) {
  const [currentTime, setCurrentTime] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at center, #18181B 0%, #09090B 100%)',
      overflow: 'hidden',
      padding: '12px'
    }}>
      {/* Native Android Mobile Device Chassis */}
      <div
        className={isDark ? 'dark-theme' : ''}
        style={{
          position: 'relative',
          width: 'min(415px, 100%)',
          height: 'min(840px, 100%)',
          maxHeight: '100%',
          background: isDark ? '#09090B' : '#FFFFFF',
          borderRadius: '36px',
          boxShadow: '0 0 0 10px #18181B, 0 25px 60px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'background 250ms ease, color 250ms ease'
        }}
      >
        {/* Native Android Status Bar */}
        <div style={{
          height: '36px',
          background: isDark ? '#09090B' : '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          fontSize: '12px',
          fontWeight: 600,
          color: isDark ? '#FAFAFA' : '#0F172A',
          zIndex: 90,
          userSelect: 'none',
          borderBottom: isDark ? '1px solid #27272A' : '1px solid #F1F5F9',
          transition: 'background 250ms ease'
        }}>
          <span>{currentTime || '09:41'}</span>

          {/* Punch-hole camera notch */}
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isDark ? '#27272A' : '#000000',
            border: '1px solid #18181B'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={13} />
            <Wifi size={13} />
            <Battery size={15} />
          </div>
        </div>

        {/* Android App Screen Viewport */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--neptune-bg-warm)'
        }}>
          {children}
        </div>

        {/* Native Android Gesture Navigation Bar */}
        <div style={{
          height: '18px',
          background: isDark ? '#09090B' : '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          borderTop: isDark ? '1px solid #27272A' : '1px solid #F1F5F9',
          transition: 'background 250ms ease'
        }}>
          <div style={{
            width: '110px',
            height: '4px',
            borderRadius: '2px',
            background: isDark ? '#3F3F46' : '#CBD5E1'
          }} />
        </div>
      </div>
    </div>
  );
}
