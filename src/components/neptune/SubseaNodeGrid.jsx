import React, { useState } from 'react';
import { Anchor, Radio, RefreshCw, Cpu, Activity, CheckCircle, Zap, Shield, ChevronRight } from 'lucide-react';

export default function SubseaNodeGrid({ onSelectNode }) {
  const [nodes, setNodes] = useState([
    { id: 'node_alpha', name: 'Beacon Alpha-1', depth: '420m', location: 'North Rift Shelf', latency: '12ms', freq: '120 kHz', syncRate: '99.98%', status: 'Optimal', active: true },
    { id: 'node_beta', name: 'Hydro Relay Beta-2', depth: '850m', location: 'Mariana Channel', latency: '18ms', freq: '140 kHz', syncRate: '99.91%', status: 'Optimal', active: true },
    { id: 'node_gamma', name: 'Acoustic Mesh Gateway-3', depth: '1200m', location: 'Subsea Ridge Basin', latency: '24ms', freq: '160 kHz', syncRate: '100.0%', status: 'Optimal', active: true },
    { id: 'node_delta', name: 'Abyssal Beacon Delta-4', depth: '1640m', location: 'Pelagic Deep Trench', latency: '31ms', freq: '180 kHz', syncRate: '99.85%', status: 'Optimal', active: true }
  ]);

  const [logs, setLogs] = useState([
    { time: '10:14:02', text: 'Beacon Alpha-1 emitted acoustic sync pulse (120 kHz)', status: 'success' },
    { time: '10:13:58', text: 'Hydro Relay Beta-2 geohash packet coarsened to Level 6', status: 'info' },
    { time: '10:13:50', text: 'Gateway-3 hydrostatic telemetry handshake complete (100% sync)', status: 'success' }
  ]);

  const handlePingNode = (nodeId, name) => {
    const nowStr = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { time: nowStr, text: `Manual acoustic ping sent to ${name} — Ack 14ms`, status: 'success' },
      ...prev.slice(0, 5)
    ]);
  };

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 24px 60px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0F172A' }}>
            Active Subsea Node Mesh
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', marginTop: '2px' }}>
            Real-time hydro-acoustic positioning beacons and deep-sea relays
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '6px 14px', borderRadius: '9999px', background: '#DBEAFE', color: '#1E40AF', fontSize: '13px', fontWeight: 600 }}>
            4 Beacons Online
          </span>
        </div>
      </div>

      {/* Node Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="subsea-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              cursor: 'pointer'
            }}
            onClick={() => onSelectNode(node)}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.15)'
                }}>
                  <Anchor size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                    {node.name}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    {node.location}
                  </span>
                </div>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '9999px',
                background: '#DCFCE7',
                color: '#15803D',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                {node.status}
              </span>
            </div>

            {/* Metrics Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px',
              background: '#F8FAFC',
              padding: '12px 10px',
              borderRadius: '16px',
              fontSize: '12px',
              textAlign: 'center',
              border: '1px solid #E2E8F0'
            }}>
              <div>
                <div style={{ color: '#64748B', fontSize: '10px', fontWeight: 600 }}>DEPTH</div>
                <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{node.depth}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '10px', fontWeight: 600 }}>LATENCY</div>
                <div style={{ fontWeight: 700, color: '#2563EB', marginTop: '2px' }}>{node.latency}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '10px', fontWeight: 600 }}>SYNC</div>
                <div style={{ fontWeight: 700, color: '#16A34A', marginTop: '2px' }}>{node.syncRate}</div>
              </div>
            </div>

            {/* Ping Action Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Freq: <strong>{node.freq}</strong>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePingNode(node.id, node.name);
                }}
                className="neptune-btn-secondary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <Radio size={14} color="#2563EB" />
                <span>Ping Node</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Subsea Packet Log Console */}
      <div style={{
        background: '#0F172A',
        color: '#F8FAFC',
        borderRadius: 'var(--radius-inner)',
        padding: '24px',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 100px 80px 0px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#38BDF8" />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>
              Acoustic Packet Telemetry Console
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600 }}>
            Live Stream (120 kHz)
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontFamily: 'monospace',
          fontSize: '13px',
          background: '#1E293B',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {logs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#64748B', fontSize: '12px' }}>[{log.time}]</span>
              <span style={{ color: log.status === 'success' ? '#4ADE80' : '#38BDF8' }}>
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
