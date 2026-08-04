import React, { useState, useRef } from 'react';
import { X, Check, RotateCw, Sun, Sliders, Sparkles, RefreshCw } from 'lucide-react';

export default function PhotoEditorModal({ isOpen, photoUrl, onClose, onApply, onRetake, title = "Edit & Filter Photo" }) {
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [contrast, setContrast] = useState(100);

  const imgRef = useRef(null);

  if (!isOpen || !photoUrl) return null;

  const filters = [
    { id: 'none', label: 'Normal', css: 'none' },
    { id: 'vibrant', label: 'Vibrant', css: 'saturate(1.4) contrast(1.15) brightness(1.05)' },
    { id: 'warm', label: 'Warm Sepia', css: 'sepia(0.4) contrast(1.1) brightness(1.05)' },
    { id: 'bw', label: 'Monochrome', css: 'grayscale(1) contrast(1.2)' },
    { id: 'cool', label: 'Cyber Cool', css: 'contrast(1.2) hue-rotate(170deg) saturate(1.3)' },
    { id: 'glow', label: 'Soft Glow', css: 'brightness(1.12) contrast(0.95) saturate(1.25) sepia(0.12)' }
  ];

  const currentFilterObj = filters.find((f) => f.id === selectedFilter) || filters[0];

  const computedCssFilter = `${currentFilterObj.css === 'none' ? '' : currentFilterObj.css} brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%)`.trim();

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApply = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Adjust dimensions if rotated 90 or 270 deg
      if (rotation === 90 || rotation === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.save();
      ctx.filter = computedCssFilter || 'none';

      // Move context to center for rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw image
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const editedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      onApply(editedDataUrl);
    };
    img.src = photoUrl;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 210,
        background: '#090D16',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 200ms ease'
      }}
    >
      {/* Header Bar */}
      <div style={{
        height: '56px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#FFFFFF',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#38BDF8" />
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
            {title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onRetake && (
            <button
              type="button"
              onClick={onRetake}
              title="Retake Photo"
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                color: '#93C5FD',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} /> Retake
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image Edit Display Canvas */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#040711',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflow: 'hidden'
      }}>
        <img
          ref={imgRef}
          src={photoUrl}
          alt="Edit preview"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '12px',
            transform: `rotate(${rotation}deg)`,
            filter: computedCssFilter,
            transition: 'transform 200ms ease, filter 200ms ease',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}
        />
      </div>

      {/* Filter Presets Carousel */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '12px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em' }}>
            SELECT FILTER
          </span>
          <button
            type="button"
            onClick={handleRotate}
            style={{
              background: 'none',
              border: 'none',
              color: '#38BDF8',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <RotateCw size={14} /> Rotate 90°
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: selectedFilter === f.id ? '2.5px solid #2563EB' : '1px solid rgba(255,255,255,0.2)',
                boxShadow: selectedFilter === f.id ? '0 0 12px rgba(37,99,235,0.6)' : 'none'
              }}>
                <img
                  src={photoUrl}
                  alt={f.label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: f.css
                  }}
                />
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: selectedFilter === f.id ? 700 : 500,
                color: selectedFilter === f.id ? '#38BDF8' : '#94A3B8'
              }}>
                {f.label}
              </span>
            </button>
          ))}
        </div>

        {/* Adjustments Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', paddingTop: '4px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>Brightness</span>
              <span style={{ fontSize: '10px', color: '#FFFFFF' }}>{brightness}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563EB' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>Contrast</span>
              <span style={{ fontSize: '10px', color: '#FFFFFF' }}>{contrast}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563EB' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>Saturation</span>
              <span style={{ fontSize: '10px', color: '#FFFFFF' }}>{saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563EB' }}
            />
          </div>
        </div>

        {/* Apply CTA Button */}
        <button
          type="button"
          onClick={handleApply}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '9999px',
            background: '#2563EB',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            marginTop: '4px'
          }}
        >
          <Check size={18} strokeWidth={2.5} />
          Use This Photo
        </button>
      </div>
    </div>
  );
}
