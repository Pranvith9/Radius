import React from 'react';
import { X, Anchor, Radio, Activity, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

export default function NodeDetailModal({ node, onClose, onPingNode }) {
  if (!node) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 200,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-outer)',
        padding: '24px',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 100px 80px 0px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1.6px solid #FFFFFF'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#DBEAFE',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Anchor size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>{node.name}</h3>
              <span style={{ fontSize: '13px', color: '#64748B' }}>{node.location}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F8FAFC',
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

        {/* Diagnostic Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>SUBSEA DEPTH</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{node.depth}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>ACOUSTIC LATENCY</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563EB', marginTop: '2px' }}>{node.latency}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>FREQUENCY BAND</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0891B2', marginTop: '2px' }}>{node.freq}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>SYNC SUCCESS RATE</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A', marginTop: '2px' }}>{node.syncRate}</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              onPingNode(node.id, node.name);
              onClose();
            }}
            className="neptune-btn-primary"
            style={{ flex: 1, padding: '12px' }}
          >
            <Radio size={16} />
            Send Test Ping
          </button>
        </div>
      </div>
    </div>
  );
}
