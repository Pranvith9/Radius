import React, { useState } from 'react';
import { Anchor, Cpu, Compass, Radio, Shield, Waves, Zap, ArrowRight, Activity, CheckCircle, RefreshCw, Layers, Signal } from 'lucide-react';

export default function NeptuneBaseHero({ onBackToApp }) {
  const [syncActive, setSyncActive] = useState(true);
  const [pingCount, setPingCount] = useState(1482);
  const [selectedNode, setSelectedNode] = useState(null);

  const subseaNodes = [
    { id: 'node_alpha', name: 'Subsea Beacon Alpha-1', depth: '420m', status: 'Optimal', latency: '12ms', syncRate: '99.98%' },
    { id: 'node_beta', name: 'Neptune Relay Hydro-2', depth: '850m', status: 'Active', latency: '18ms', syncRate: '99.91%' },
    { id: 'node_gamma', name: 'Acoustic Mesh Gateway 3', depth: '1200m', status: 'Optimal', latency: '24ms', syncRate: '100.0%' }
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)', // Deep Ocean Slate Blue Canvas
      color: '#F8FAFC',
      fontFamily: "'Geist', 'Plus Jakarta Sans', sans-serif",
      padding: '24px 16px 40px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
      {/* Top Header Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)', // Electric Cyan to Royal Blue
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.5)'
          }}>
            <Waves size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, lineHeight: '20px', color: '#FFFFFF' }}>
              Neptune Base
            </h1>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Seamless Subsea Sync
            </span>
          </div>
        </div>

        <button
          onClick={onBackToApp}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            background: '#2563EB', // Neptune Primary Blue Button
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Return to App</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Hero Section Container with Gradient Border Shell (Per Design Specs) */}
      <div style={{
        position: 'relative',
        borderRadius: '40px',
        padding: '1.6px',
        background: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 50%, rgba(37, 99, 235, 0.2) 100%)', // Vibrant Blue Border Shell
        boxShadow: '0px 12.5px 24px rgba(37, 99, 235, 0.25), 0px 41.8px 33.4px rgba(15, 23, 42, 0.4)'
      }}>
        {/* Inset Surface Container (39px radius) */}
        <div style={{
          background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '39px',
          padding: '36px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px'
        }}>
          {/* Subsea Sync Badge (#DBEAFE background with #2563EB Royal Blue text) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(219, 234, 254, 0.15)',
            color: '#38BDF8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            <Radio size={14} color="#38BDF8" className="pulse-ring-active" />
            Subsea Acoustic Mesh Telemetry
          </div>

          {/* Headline Hierarchy: Display Lg Geist 60px light weight 300 */}
          <h2 style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: '36px',
            fontWeight: 300,
            lineHeight: '44px',
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            maxWidth: '480px'
          }}>
            Seamless Subsea Synchronization Engine
          </h2>

          {/* Supporting Body Text: Body Md Geist 18px */}
          <p style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: '24px',
            color: '#94A3B8',
            maxWidth: '420px'
          }}>
            Ultra-low latency underwater positioning, geohash data streaming, and proximity mesh tracking built with blue acoustic relays.
          </p>

          {/* Primary CTA Button (#2563EB, 9999px rounded) */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setPingCount((p) => p + 1);
                setSyncActive(true);
              }}
              style={{
                backgroundColor: '#2563EB', // Royal Blue
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '14px 28px',
                border: 'none',
                fontFamily: "'Geist', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(37, 99, 235, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 150ms ease'
              }}
            >
              <RefreshCw size={16} />
              Ping Subsea Sync ({pingCount})
            </button>

            <button
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#E2E8F0',
                borderRadius: '9999px',
                padding: '14px 22px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontFamily: "'Geist', sans-serif",
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Telemetry Logs
            </button>
          </div>
        </div>
      </div>

      {/* Subsea Metric Feature Cards Grid (Blue & Cyan Accents) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>
            Active Subsea Node Mesh
          </h3>
          <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600 }}>3 Nodes Online</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {subseaNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                borderRadius: '39px',
                padding: '1.6px',
                background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)', // Rich Oceanic Blue Gradient Frame
                cursor: 'pointer',
                boxShadow: '0px 6px 16px rgba(37, 99, 235, 0.2)'
              }}
            >
              <div style={{
                background: '#1E293B',
                borderRadius: '38px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.2)',
                      color: '#38BDF8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}>
                      <Anchor size={18} />
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{node.name}</span>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 9px',
                    borderRadius: '9999px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ADE80',
                    border: '1px solid rgba(74, 222, 128, 0.3)'
                  }}>
                    {node.status}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  background: '#0F172A',
                  padding: '12px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div>
                    <div style={{ color: '#94A3B8', fontSize: '10px', fontWeight: 600 }}>DEPTH</div>
                    <div style={{ fontWeight: 700, color: '#F8FAFC', marginTop: '2px' }}>{node.depth}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94A3B8', fontSize: '10px', fontWeight: 600 }}>LATENCY</div>
                    <div style={{ fontWeight: 700, color: '#38BDF8', marginTop: '2px' }}>{node.latency}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94A3B8', fontSize: '10px', fontWeight: 600 }}>SYNC RATE</div>
                    <div style={{ fontWeight: 700, color: '#4ADE80', marginTop: '2px' }}>{node.syncRate}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subsea Sync Integration Architecture Details (Deep Blue Surface) */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', // Deep Ocean Blue Gradient
        borderRadius: '39px',
        padding: '24px 20px',
        border: '1px solid rgba(37, 99, 235, 0.4)',
        boxShadow: '0 8px 24px rgba(30, 58, 138, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60A5FA' }}>
          <Cpu size={22} />
          <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
            Subsea Geohash Synchronization Pipeline
          </h4>
        </div>
        <p style={{ fontSize: '13px', color: '#93C5FD', lineHeight: '20px' }}>
          Neptune Base streams truncated acoustic geohash pulses between underwater beacons and mobile edge clients. Coordinates are coarsened to prevent precise location exposure while guaranteeing seamless subsea proximity matching.
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <span style={{ padding: '6px 12px', borderRadius: '9999px', background: '#DBEAFE', color: '#1E40AF', fontSize: '12px', fontWeight: 700 }}>
            Geohash Precision: Level 6 (~1.2 km)
          </span>
          <span style={{ padding: '6px 12px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.4)', fontSize: '12px', fontWeight: 700 }}>
            Acoustic Telemetry: 120 kHz (Blue Relay)
          </span>
        </div>
      </div>
    </div>
  );
}
