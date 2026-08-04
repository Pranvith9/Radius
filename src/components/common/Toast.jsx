import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10B981" />;
      case 'warning':
        return <AlertCircle size={18} color="#F59E0B" />;
      case 'error':
        return <XCircle size={18} color="#EF4444" />;
      case 'info':
      default:
        return <Info size={18} color="#3B82F6" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      case 'error':
        return 'rgba(239, 68, 68, 0.4)';
      case 'info':
      default:
        return 'rgba(59, 130, 246, 0.4)';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '64px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(12px)',
        color: '#FFFFFF',
        padding: '10px 16px',
        borderRadius: '9999px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), 0 0 0 1px ' + getBorderColor(),
        fontSize: '13px',
        fontWeight: 600,
        maxWidth: '90%',
        animation: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'auto'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {getIcon()}
      </div>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          marginLeft: '4px'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
