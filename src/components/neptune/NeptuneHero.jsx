import React from 'react';
import { Radio, ArrowRight, Waves, ShieldCheck, Activity, Database, Cpu, Compass } from 'lucide-react';

export default function NeptuneHero({ onPing, pingCount, onExploreTelemetry }) {
  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 24px 40px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      {/* Above-the-fold Hero Messaging Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px',
        maxWidth: '840px',
        margin: '0 auto'
      }}>
        {/* Supporting Tag Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '9999px',
          background: '#DBEAFE',
          color: '#1E40AF',
          fontSize: '14px',
          fontWeight: 500,
          border: '1px solid #BFDBFE'
        }}>
          <Radio size={16} color="#2563EB" className="sync-pulse-active" />
          <span>Acoustic Subsea Mesh & Geohash Synchronization</span>
        </div>

        {/* Display Lg Headline (Geist, 60px, weight 300, line-height 60px, letter-spacing -0.025em) */}
        <h1 className="display-lg" style={{ color: '#0F172A' }}>
          Seamless Subsea Synchronization Engine
        </h1>

        {/* Body Md Text (Geist, 18px, weight 400, line-height 28px) */}
        <p className="body-md" style={{ color: '#64748B', maxWidth: '680px' }}>
          Neptune Base introduces zero-trust acoustic positioning, real-time deep ocean geohash streaming, and subsea telemetry for high-reliability offshore operations.
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '8px'
        }}>
          <button
            onClick={onPing}
            className="neptune-btn-primary"
          >
            <Activity size={18} />
            <span>Ping Subsea Beacon ({pingCount})</span>
          </button>

          <button
            onClick={onExploreTelemetry}
            className="neptune-btn-secondary"
          >
            <span>Explore Telemetry Logs</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Hero Panel Container with Gradient Border Shell (40px Outer, 39px Inner Radius) */}
      <div className="gradient-border-shell">
        <div className="gradient-border-shell-inner" style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Panel Top Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            borderBottom: '1px solid #E2E8F0',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#CFFAFE',
                color: '#0891B2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Waves size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>
                  Subsea Hydro-Acoustic Mesh Status
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Real-time telemetry stream • Geohash Coarsened Output
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '9999px',
                background: '#DCFCE7',
                color: '#15803D',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                Subsea Mesh Operational
              </span>
            </div>
          </div>

          {/* Interactive Metric Cards inside Hero Shell */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {/* Metric 1 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>AVERAGE DEPTH</span>
                <Compass size={18} color="#2563EB" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                820 m
              </div>
              <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 500 }}>
                Hydrostatic Stability: Optimal
              </div>
            </div>

            {/* Metric 2 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>ACOUSTIC LATENCY</span>
                <Activity size={18} color="#06B6D4" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                14.2 ms
              </div>
              <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 500 }}>
                Ultra-Low Latency Pulse
              </div>
            </div>

            {/* Metric 3 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>GEOHASH COARSENING</span>
                <ShieldCheck size={18} color="#2563EB" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                Level 6
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Privacy Protected (~1.2 km precision)
              </div>
            </div>

            {/* Metric 4 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>SYNC SUCCESS RATE</span>
                <Database size={18} color="#16A34A" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                99.98%
              </div>
              <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 500 }}>
                Zero-Loss Telemetry Stream
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
