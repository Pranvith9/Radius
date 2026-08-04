import React from 'react';
import { Eye, EyeOff, Shield, AlertCircle, SlidersHorizontal, ShieldAlert, Check } from 'lucide-react';

export default function Header({
  currentUser,
  onToggleVisibility,
  onOpenFilter,
  panicActive,
  onTogglePanic,
  onOpenSafety,
  onOpenProfile
}) {
  return (
    <header style={{
      padding: '12px 16px',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 50
    }}>
      {/* App Top Bar: Profile Avatar (Top Left), Brand, Discoverability Toggle, Panic Pause */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Top Left End: User's Profile Picture Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenProfile}
            title="View Your Profile & Account Settings"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div className="avatar-container" style={{ position: 'relative' }}>
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #2563EB',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                }}
              />
              {currentUser.isVerified && (
                <div className="verified-badge" style={{ width: '14px', height: '14px' }}>
                  <Check size={8} strokeWidth={3} />
                </div>
              )}
            </div>
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--color-text-primary)'
            }}>
              {currentUser.name}
            </span>
          </button>
        </div>

        {/* Discoverability & Panic Pause Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Quick Panic Pause Button */}
          <button
            onClick={onTogglePanic}
            title="Panic / Vacation Mode — Instant pause all visibility"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '9999px',
              background: panicActive ? '#FEF2F2' : 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              border: panicActive ? '1px solid #FEE2E2' : '1px solid rgba(239, 68, 68, 0.25)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            <ShieldAlert size={13} />
            {panicActive ? 'Paused' : 'Panic'}
          </button>

          {/* Discoverability Switch */}
          <button
            onClick={onToggleVisibility}
            title="Toggle Visibility"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '9999px',
              border: 'none',
              background: panicActive
                ? '#FEF2F2'
                : currentUser.visibility
                  ? '#DBEAFE'
                  : 'var(--color-bg)',
              color: panicActive
                ? '#EF4444'
                : currentUser.visibility
                  ? '#1E40AF'
                  : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              border: currentUser.visibility
                ? '1px solid rgba(37, 99, 235, 0.3)'
                : '1px solid var(--color-border)'
            }}
          >
            {panicActive ? (
              <>
                <AlertCircle size={13} color="#EF4444" />
                Off
              </>
            ) : currentUser.visibility ? (
              <>
                <Eye size={13} color="#2563EB" />
                Visible
              </>
            ) : (
              <>
                <EyeOff size={13} color="var(--color-text-secondary)" />
                Hidden
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
