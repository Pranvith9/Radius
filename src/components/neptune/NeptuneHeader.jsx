import React from 'react';
import { Waves, Radio, Activity, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

export default function NeptuneHeader({ activeTab, onNavClick, onLaunchSync, pingCount }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E2E8F0',
      padding: '16px 24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand & Mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}>
            <Waves size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, lineHeight: '22px', color: '#0F172A' }}>
              Neptune Base
            </h1>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
              Seamless Subsea Sync
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F8FAFC',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid #E2E8F0'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'nodes', label: 'Subsea Nodes' },
            { id: 'pipeline', label: 'Acoustic Pipeline' },
            { id: 'telemetry', label: 'Telemetry Logs' }
          ].map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavClick(link.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#0F172A' : '#64748B',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Active Ping Pulse Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '9999px',
            background: '#DBEAFE',
            color: '#1E40AF',
            fontSize: '12px',
            fontWeight: 600
          }}>
            <Radio size={14} color="#2563EB" className="sync-pulse-active" />
            <span>Pings: <strong>{pingCount}</strong></span>
          </div>

          <button
            onClick={onLaunchSync}
            className="neptune-btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            <span>Launch Sync Engine</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
