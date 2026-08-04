import React, { useState } from 'react';
import { X, Filter, Check, ShieldCheck, Zap } from 'lucide-react';
import { INTEREST_OPTIONS } from '../../data/mockData';

export default function FilterModal({
  isOpen,
  onClose,
  currentRadius,
  onApplyRadius,
  verifiedOnly,
  onToggleVerifiedOnly,
  activeNowOnly,
  onToggleActiveNowOnly,
  selectedInterests,
  onToggleInterestFilter
}) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const radiusOptions = ["500m", "1 km", "5 km", "15 km", "City-wide"];

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
        zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
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
          maxHeight: '88%',
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          padding: '20px 20px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
          cursor: 'default'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="#2563EB" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Discovery Filters</h3>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toggles: Verified Only & Active Now */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Trust & Presence Controls
          </label>

          <div
            onClick={onToggleVerifiedOnly}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '16px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="#2563EB" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Verified Profiles Only</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Show users who passed photo verification</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={() => {}}
              style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
            />
          </div>

          <div
            onClick={onToggleActiveNowOnly}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '16px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color="#16A34A" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Active Now Only</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Show users online in the last 15 minutes</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={activeNowOnly}
              onChange={() => {}}
              style={{ width: '18px', height: '18px', accentColor: '#16A34A', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Filter by Shared Interests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Filter by Shared Interests
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => onToggleInterestFilter(interest)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: isSelected ? '1px solid #2563EB' : '1px solid var(--color-border)',
                    background: isSelected ? '#DBEAFE' : 'var(--color-surface)',
                    color: isSelected ? '#1E40AF' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isSelected && <Check size={12} />}
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply CTA */}
        <button
          onClick={handleClose}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', marginTop: '8px' }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
