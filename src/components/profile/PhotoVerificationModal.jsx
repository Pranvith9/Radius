import React, { useState } from 'react';
import { X, Camera, CheckCircle, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function PhotoVerificationModal({ isOpen, onClose, onCompleteVerification }) {
  if (!isOpen) return null;

  const [step, setStep] = useState('intro'); // 'intro' | 'scanning' | 'complete'

  const handleStartScan = () => {
    setStep('scanning');
    setTimeout(() => {
      setStep('complete');
    }, 2500);
  };

  const handleFinish = () => {
    onCompleteVerification();
    onClose();
    setStep('intro');
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 220,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }}>
      <div className="animate-fade-up" style={{
        width: '100%',
        maxHeight: '90%',
        background: 'var(--color-surface)',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
        padding: '20px 20px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--shadow-modal)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--color-primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Photo Liveness Verification</h3>
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

        {step === 'intro' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '10px auto 0 auto'
            }}>
              <Camera size={40} />
            </div>

            <div>
              <h4 style={{ fontSize: '17px', fontWeight: 700 }}>Verify Your Identity</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: '18px' }}>
                To keep Nearby safe, all users must complete a quick 5-second 3D liveness scan before turning on discoverability.
              </p>
            </div>

            <div style={{
              background: '#FAFAF9',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              textAlign: 'left'
            }}>
              <strong>What happens next?</strong>
              <ul style={{ paddingLeft: '18px', marginTop: '6px', lineHeight: '18px' }}>
                <li>Center your face in the camera frame</li>
                <li>Turn your head slightly when prompted</li>
                <li>Your selfie is checked against your photos</li>
              </ul>
            </div>

            <button onClick={handleStartScan} className="btn btn-primary" style={{ padding: '12px' }}>
              Start Liveness Check
            </button>
          </div>
        )}

        {step === 'scanning' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
            <div style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid var(--color-primary)',
              background: '#18181B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="pulse-ring-active" style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid #22C55E'
              }} />
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600"
                alt="Scanning preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(251, 146, 60, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RefreshCw size={36} color="#FFFFFF" className="pulse-ring-active" style={{ animation: 'spin 2s linear infinite' }} />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-hover)' }}>
                Analyzing facial geometry...
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Please hold still and stay in frame
              </div>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', padding: '10px 0' }}>
            <CheckCircle size={56} color="#22C55E" />

            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700 }}>Verification Passed!</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Your photo verification is confirmed. A <strong>Verified Profile</strong> badge has been added to your profile and discoverability is now unlocked!
              </p>
            </div>

            <button onClick={handleFinish} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Unlock Discoverability
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
