import React, { useState, useEffect } from 'react';
import PersonCard from './PersonCard';
import MapView from './MapView';
import { LayoutGrid, Square, Filter, Search, RefreshCw, EyeOff, ShieldAlert, Eye, SlidersHorizontal } from 'lucide-react';

export default function NearbyFeed({
  users,
  currentUser,
  panicActive,
  onToggleVisibility,
  onSelectPerson,
  onConnectPerson,
  pendingRequestUserIds,
  connectedUserIds = [],
  onOpenChat,
  onOpenFilter,
  onOpenRadius,
  activeFilterCount,
  onRefreshFeed,
  initialViewMode = 'grid2'
}) {
  const [viewMode, setViewMode] = useState(initialViewMode === 'grid1' ? 'grid1' : 'grid2'); // 'grid2' | 'grid1'
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scanning state for turning visibility ON
  const [isScanning, setIsScanning] = useState(false);
  const [scanningMessage, setScanningMessage] = useState('Syncing subsea coordinates...');

  const handleTurnOnVisibility = () => {
    setIsScanning(true);
    setScanningMessage('Establishing secure subsea node connection...');
    
    setTimeout(() => {
      setScanningMessage('Syncing coarse proximity coordinates...');
    }, 600);
    
    setTimeout(() => {
      setScanningMessage('Loading verified nearby connections...');
    }, 1200);

    setTimeout(() => {
      setIsScanning(false);
      onToggleVisibility();
    }, 1800);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshFeed();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Filter users by search query
  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.interests.some((i) => i.toLowerCase().includes(q)) ||
      u.bio.toLowerCase().includes(q)
    );
  });

  // Radar Visual for Scanning Transition
  if (isScanning) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 24px',
        textAlign: 'center',
        background: 'var(--color-bg)',
        color: 'var(--color-text-primary)'
      }}>
        <div className="sonar-container">
          <div className="sonar-pulse-ring" />
          <div className="sonar-pulse-ring" style={{ animationDelay: '1.33s' }} />
          <div className="sonar-pulse-ring" style={{ animationDelay: '2.66s' }} />
          <div className="sonar-radar-line" />
          <div style={{
            position: 'absolute',
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'rgba(37, 99, 235, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563EB',
            zIndex: 2
          }}>
            <RefreshCw size={36} className="pulse-ring-active" style={{ animation: 'spin 2s linear infinite' }} />
          </div>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Discovering Nearby...
        </h3>

        <p className="animate-fade-in" key={scanningMessage} style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          lineHeight: '20px',
          maxWidth: '300px',
          fontFamily: 'var(--font-family)',
          marginTop: '4px'
        }}>
          {scanningMessage}
        </p>
      </div>
    );
  }

  // Dedicated Hidden Mode Front Screen when Discoverability is OFF or Panic Active
  if (!currentUser.visibility || panicActive) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 24px',
        textAlign: 'center',
        background: 'var(--color-bg)',
        color: 'var(--color-text-primary)'
      }}>
        <div className="sonar-container">
          <div className="sonar-pulse-ring" style={{ animation: 'none', borderStyle: 'solid', opacity: 0.08 }} />
          <div style={{
            position: 'absolute',
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: panicActive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(37, 99, 235, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: panicActive ? '#EF4444' : '#2563EB',
            boxShadow: panicActive ? '0 10px 25px rgba(239, 68, 68, 0.12)' : '0 10px 25px rgba(37, 99, 235, 0.12)',
            zIndex: 2
          }}>
            {panicActive ? <ShieldAlert size={42} /> : <EyeOff size={42} />}
          </div>
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          {panicActive ? 'Panic Pause Mode Active' : 'Hidden Mode Active'}
        </h3>

        <p style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          lineHeight: '22px',
          maxWidth: '300px',
          marginBottom: '24px'
        }}>
          {panicActive
            ? 'Your profile, location, and requests are currently paused for privacy. Turn off Panic Mode to resume discovery.'
            : 'You are currently in Hidden Mode. You cannot be discovered by anyone nearby, and you cannot discover anyone nearby.'}
        </p>

        {!panicActive && (
          <button
            onClick={handleTurnOnVisibility}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Eye size={18} />
            Turn ON Visibility & Discover Nearby
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Search & Layout View Switcher Sub-Bar */}
      <div style={{
        padding: '10px 14px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 10
      }}>
        {/* Search Input */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: '9999px',
          padding: '6px 12px'
        }}>
          <Search size={15} color="var(--color-text-secondary)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nearby interest, name..."
            style={{
              border: 'none',
              background: 'transparent',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              outline: 'none',
              width: '100%',
              fontFamily: 'var(--font-family)',
              padding: 0
            }}
          />
        </div>

        {/* Radius Filter Pill Button */}
        <button
          onClick={onOpenRadius || onOpenFilter}
          title="Change Discovery Radius"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '9999px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <SlidersHorizontal size={13} color="#2563EB" />
          <span>{currentUser?.radius || '5 km'}</span>
        </button>

        {/* View Mode Controls: 2-Col Grid vs 1-Col Stack (Map removed per request) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-border)',
          borderRadius: '9999px',
          padding: '3px'
        }}>
          <button
            onClick={() => setViewMode('grid2')}
            title="Compact 2-Column Grid"
            style={{
              background: viewMode === 'grid2' ? 'var(--color-surface)' : 'transparent',
              color: viewMode === 'grid2' ? '#2563EB' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: '9999px',
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid2' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <LayoutGrid size={16} />
          </button>

          <button
            onClick={() => setViewMode('grid1')}
            title="Single Column Stack"
            style={{
              background: viewMode === 'grid1' ? 'var(--color-surface)' : 'transparent',
              color: viewMode === 'grid1' ? '#2563EB' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: '9999px',
              padding: '5px 10px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid1' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Square size={16} />
          </button>
        </div>

        {/* Filter Modal Trigger */}
        <button
          onClick={onOpenFilter}
          title="Filter Preferences"
          style={{
            position: 'relative',
            background: activeFilterCount > 0 ? '#DBEAFE' : 'var(--color-bg)',
            color: activeFilterCount > 0 ? '#1E40AF' : 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Filter size={16} />
          {activeFilterCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              background: '#2563EB',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 700,
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area: Grid vs Stack */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', position: 'relative' }}>
        {filteredUsers.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid2' ? 'repeat(2, 1fr)' : '1fr',
            gap: '14px'
          }}>
            {filteredUsers.map((user) => (
              <PersonCard
                key={user.id}
                user={user}
                onSelectPerson={onSelectPerson}
                onConnectPerson={onConnectPerson}
                hasPendingRequest={pendingRequestUserIds.includes(user.id)}
                isConnected={connectedUserIds.includes(user.id)}
                onOpenChat={onOpenChat}
                compact={viewMode === 'grid2'}
              />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#64748B'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
              No nearby people match criteria
            </h4>
            <p style={{ fontSize: '13px', maxWidth: '260px' }}>
              Try widening your radius or clearing interest filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
