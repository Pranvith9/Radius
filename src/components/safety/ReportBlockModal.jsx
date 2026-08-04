import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, Lock } from 'lucide-react';

export default function ReportBlockModal({ isOpen, targetUser, onClose, onConfirmBlock }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen || !targetUser) return null;

  const reasons = [
    "Inappropriate or disrespectful behavior",
    "Harassment or unsolicited explicit content",
    "Fake profile, catfishing, or stolen photos",
    "Spam, commercial solicitation, or scams",
    "Underage account",
    "Felt unsafe or uncomfortable"
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReason) return;

    setSubmitted(true);
    setTimeout(() => {
      onConfirmBlock(targetUser, selectedReason, details);
      setSubmitted(false);
      setSelectedReason('');
      setDetails('');
      onClose();
    }, 1200);
  };

  return (
    <div
      onClick={handleClose}
      className={isClosing ? 'animate-fade-out' : 'animate-fade-in'}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 220,
        background: 'rgba(0,0,0,0.6)',
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
          maxHeight: '90%',
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          padding: '20px 20px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
          cursor: 'default'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
            <ShieldAlert size={22} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Block & Report {targetUser.name.split(' ')[0]}
            </h3>
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

        {submitted ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '30px 10px',
            textAlign: 'center'
          }}>
            <CheckCircle size={48} color="#22C55E" />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Report Submitted & User Blocked</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', maxWidth: '300px' }}>
              {targetUser.name.split(' ')[0]} has been immediately blocked and removed from your discovery, messages, and calls. Our moderation team will review this report.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Automatic Block Warning Notice */}
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '12px',
              color: '#B91C1C',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <Lock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Atomic Block Action:</strong> Reporting immediately cancels all requests, closes chat threads, terminates active calls, and hides both profiles from each other permanently.
              </div>
            </div>

            {/* Select Reason */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Select a reason for reporting:
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {reasons.map((reason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: selectedReason === reason ? '1px solid #EF4444' : '1px solid var(--color-border)',
                      background: selectedReason === reason ? '#FEF2F2' : 'var(--color-bg)',
                      color: selectedReason === reason ? '#DC2626' : 'var(--color-text-primary)',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: selectedReason === reason ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Additional details (optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what happened..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-family)',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            {/* Submit Block */}
            <button
              type="submit"
              disabled={!selectedReason}
              className="btn btn-danger"
              style={{
                width: '100%',
                padding: '12px',
                opacity: selectedReason ? 1 : 0.5,
                cursor: selectedReason ? 'pointer' : 'default'
              }}
            >
              Block & Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
