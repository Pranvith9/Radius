import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Phone, Users, HeartHandshake } from 'lucide-react';

export default function SafetyTipsModal({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240);
  };

  const tips = [
    {
      title: "Meet in Public Places",
      desc: "For your first meetup, pick a busy, well-lit public space such as a popular coffee shop, park, or restaurant.",
      icon: MapPin
    },
    {
      title: "Share Plans with a Friend",
      desc: "Tell a trusted friend or family member where you're going, who you're meeting, and when you expect to return.",
      icon: Users
    },
    {
      title: "Stay in Control of Transportation",
      desc: "Arrange your own ride to and from the meeting spot. Avoid letting someone pick you up at your home on a first meetup.",
      icon: Phone
    },
    {
      title: "Keep Personal Info Private",
      desc: "Never share your exact address, financial details, or work location until mutual trust is established.",
      icon: ShieldCheck
    }
  ];

  return (
    <div
      onClick={handleClose}
      className={isClosing ? 'animate-fade-out' : 'animate-fade-in'}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 220,
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
          gap: '16px',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
          cursor: 'default'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartHandshake size={22} color="var(--color-primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Safe Meetup Guidelines</h3>
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
          Your safety is our top priority. Here are recommended safety practices when connecting with nearby people:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tips.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: '18px' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleClose}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          Got It, Thanks
        </button>
      </div>
    </div>
  );
}
