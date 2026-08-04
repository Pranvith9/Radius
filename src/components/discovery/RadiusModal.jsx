import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

export default function RadiusModal({
  isOpen,
  onClose,
  currentRadius,
  onApplyRadius
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
        zIndex: 200,
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
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          padding: '20px 20px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-modal)',
          cursor: 'default'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={18} color="#2563EB" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Select Discovery Radius</h3>
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

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          Choose how far away you want to discover nearby people:
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {radiusOptions.map((rad) => {
            const isSelected = currentRadius === rad;
            return (
              <button
                key={rad}
                onClick={() => {
                  onApplyRadius(rad);
                  handleClose();
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isSelected ? '1px solid #2563EB' : '1px solid var(--color-border)',
                  background: isSelected ? '#DBEAFE' : 'var(--color-bg)',
                  color: isSelected ? '#1E40AF' : 'var(--color-text-primary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <span>{rad}</span>
                {isSelected && <Check size={16} color="#2563EB" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
