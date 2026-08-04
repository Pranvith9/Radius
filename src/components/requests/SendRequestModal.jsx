import React, { useState } from 'react';
import { X, Send, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

export default function SendRequestModal({ isOpen, targetPerson, onClose, onSendRequest }) {
  if (!isOpen || !targetPerson) return null;

  const [introMessage, setIntroMessage] = useState(
    targetPerson.icebreaker ? `Hi ${targetPerson.name.split(' ')[0]}! ${targetPerson.icebreaker}`.slice(0, 95) : ''
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSend = () => {
    if (introMessage.length > 100) {
      setErrorMsg('Intro message cannot exceed 100 characters per PRD guidelines.');
      return;
    }
    onSendRequest(targetPerson, introMessage);
    onClose();
  };

  return (
    <div
      onClick={onClose}
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
        className="animate-fade-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'var(--color-surface)',
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
            <MessageCircle size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              Send Request to {targetPerson.name.split(' ')[0]}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F5F5F4',
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

        {/* Target Summary */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          borderRadius: '12px',
          background: '#FAFAF9',
          border: '1px solid var(--color-border)'
        }}>
          <img
            src={targetPerson.photo}
            alt={targetPerson.name}
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>
              {targetPerson.name}, {targetPerson.age}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Proximity: {targetPerson.distance} • {targetPerson.interests.slice(0, 2).join(', ')}
            </div>
          </div>
        </div>

        {/* Intro Message Input (Max 100 chars) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Short Intro Message (Optional, max 100 chars)
            </label>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: introMessage.length > 100 ? '#EF4444' : 'var(--color-text-muted)'
            }}>
              {introMessage.length} / 100
            </span>
          </div>

          <textarea
            value={introMessage}
            onChange={(e) => {
              setIntroMessage(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Add a friendly greeting or answer their icebreaker..."
            maxLength={100}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: introMessage.length > 100 ? '1px solid #EF4444' : '1px solid var(--color-border)',
              fontFamily: 'var(--font-family)',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              background: '#FFFFFF'
            }}
          />
        </div>

        {/* Icebreaker Recommendation Chip */}
        {targetPerson.icebreaker && (
          <div
            onClick={() => setIntroMessage(targetPerson.icebreaker.slice(0, 100))}
            style={{
              fontSize: '12px',
              color: 'var(--color-primary-hover)',
              background: 'var(--color-primary-light)',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={13} color="var(--color-primary)" />
            <span>Use Icebreaker prompt: "{targetPerson.icebreaker}"</span>
          </div>
        )}

        {/* Error notice if any */}
        {errorMsg && (
          <div style={{ color: '#EF4444', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={14} />
            {errorMsg}
          </div>
        )}

        {/* Consent Rule Banner */}
        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
          🔒 Chat will unlock only if {targetPerson.name.split(' ')[0]} accepts your connection request.
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSend}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          <Send size={16} />
          Send Connection Request
        </button>
      </div>
    </div>
  );
}
