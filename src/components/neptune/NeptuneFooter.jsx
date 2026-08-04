import React from 'react';
import { Waves, ShieldCheck, Radio, CheckCircle } from 'lucide-react';

export default function NeptuneFooter() {
  return (
    <footer style={{
      background: '#0F172A',
      color: '#F8FAFC',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '40px 24px 32px 24px',
      marginTop: '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Waves size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>Neptune Base</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>Seamless Subsea Synchronization Architecture</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4ADE80', background: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
            <CheckCircle size={14} />
            <span>All Hydro-Acoustic Beacons Operational</span>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '13px',
          color: '#64748B'
        }}>
          <span>© 2026 Neptune Base Technologies • Built strictly to design specs</span>
          <span>Geohash Level 6 Precision Enabled</span>
        </div>
      </div>
    </footer>
  );
}
