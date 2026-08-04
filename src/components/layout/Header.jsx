import React from 'react';
import { LocateFixed, Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';

export default function Header({
  currentUser,
  onToggleVisibility,
  panicActive,
  onTogglePanic,
  onOpenProfile
}) {
  return (
    <header style={{
      padding: '12px 16px',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 50
    }}>
      {/* Brand Title & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF'
        }}>
          <LocateFixed size={18} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          Radius
        </span>
      </div>

      {/* Right Action Items: Profile Avatar & Status Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Panic Pause Switch */}
        <button
          onClick={onTogglePanic}
          title="Panic Pause - Hide from radar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '9999px',
            background: panicActive ? '#FEF2F2' : 'rgba(239, 68, 68, 0.08)',
            color: '#EF4444',
            border: panicActive ? '1px solid #FEE2E2' : '1px solid rgba(239, 68, 68, 0.2)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          <ShieldAlert size={13} />
          {panicActive ? 'Paused' : 'Pause'}
        </button>

        {/* Visibility Switch */}
        <button
          onClick={onToggleVisibility}
          title="Toggle Radar Visibility"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 11px',
            borderRadius: '9999px',
            border: currentUser.visibility && !panicActive ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid var(--color-border)',
            background: currentUser.visibility && !panicActive ? 'rgba(37, 99, 235, 0.1)' : 'var(--color-bg)',
            color: currentUser.visibility && !panicActive ? '#2563EB' : 'var(--color-text-secondary)',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {currentUser.visibility && !panicActive ? (
            <>
              <Eye size={13} />
              <span>Visible</span>
            </>
          ) : (
            <>
              <EyeOff size={13} />
              <span>Hidden</span>
            </>
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={onOpenProfile}
          title="My Profile & Settings"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <img
            src={currentUser.photo}
            alt={currentUser.name}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #2563EB'
            }}
          />
          {currentUser.isVerified && (
            <div className="verified-badge" style={{ width: '12px', height: '12px' }}>
              <Check size={7} strokeWidth={3} />
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
