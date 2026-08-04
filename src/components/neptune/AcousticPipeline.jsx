import React from 'react';
import { Cpu, ShieldCheck, Database, Layers, Radio, Lock, Zap, Server } from 'lucide-react';

export default function AcousticPipeline() {
  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 24px 60px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 600, color: '#0F172A' }}>
          Acoustic Geohash Pipeline Architecture
        </h2>
        <p style={{ fontSize: '16px', color: '#64748B', marginTop: '6px' }}>
          Zero-trust underwater telemetry streaming with Privacy Level 6 geohash coarsening.
        </p>
      </div>

      {/* Pipeline Diagram Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {/* Stage 1 */}
        <div className="subsea-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#CFFAFE',
              color: '#0891B2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              01
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
              Acoustic Hydro Transceiver
            </h4>
          </div>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '20px' }}>
            Subsea beacons emit multi-frequency sonar pulses at 120-180 kHz, encoding raw hydrostatic pressure and depth telemetry.
          </p>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', background: '#DBEAFE', padding: '6px 12px', borderRadius: '9999px', alignSelf: 'flex-start' }}>
            Acoustic Signal: Active
          </div>
        </div>

        {/* Stage 2 */}
        <div className="subsea-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#DBEAFE',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              02
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
              Geohash Coarsening Engine
            </h4>
          </div>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '20px' }}>
            Coordinates are automatically rounded to Level 6 geohash precision (~1.2 km radius band), preventing exact GPS tracing.
          </p>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '6px 12px', borderRadius: '9999px', alignSelf: 'flex-start' }}>
            Privacy Masking: Level 6
          </div>
        </div>

        {/* Stage 3 */}
        <div className="subsea-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              03
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
              Subsea Gateway API Relay
            </h4>
          </div>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '20px' }}>
            Encrypted WebSockets relay low-latency positioning telemetry to connected edge clients and mobile applications.
          </p>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#D97706', background: '#FEF3C7', padding: '6px 12px', borderRadius: '9999px', alignSelf: 'flex-start' }}>
            WebSocket Relay: Connected
          </div>
        </div>
      </div>
    </section>
  );
}
