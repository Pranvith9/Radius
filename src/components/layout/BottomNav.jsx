import React from 'react';
import { Home, Film, UserPlus, MessageSquare, MapPin } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange, pendingRequestsCount, unreadChatsCount }) {
  const tabs = [
    { id: 'nearby', label: 'Home', icon: Home, badge: 0 },
    { id: 'feed', label: 'Feed', icon: Film, badge: 0 },
    { id: 'requests', label: 'Requests', icon: UserPlus, badge: pendingRequestsCount },
    { id: 'chats', label: 'Chats', icon: MessageSquare, badge: unreadChatsCount },
    { id: 'map', label: 'Map', icon: MapPin, badge: 0 }
  ];

  return (
    <nav style={{
      height: '60px',
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
      padding: '0 4px'
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              height: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? '#2563EB' : 'var(--color-text-secondary)',
              position: 'relative',
              transition: 'color 150ms ease',
              paddingBottom: '6px'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.3 : 1.8} 
                className={isActive ? 'nav-icon-active' : ''} 
              />
              {tab.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 700,
                  minWidth: '15px',
                  height: '15px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  boxShadow: '0 1px 4px rgba(37, 99, 235, 0.4)'
                }}>
                  {tab.badge}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? 600 : 500
            }}>
              {tab.label}
            </span>
            {isActive && (
              <span style={{
                position: 'absolute',
                bottom: '2px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#2563EB',
                animation: 'fade-in 200ms ease-out forwards'
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
