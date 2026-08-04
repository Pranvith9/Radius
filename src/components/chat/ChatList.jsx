import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatList({ chats, onSelectChat, currentUserId = 'usr_000' }) {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: 'var(--neptune-bg-warm)'
    }}>
      {chats.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chats.map((chat) => {
            const { matchUser, messages, status } = chat;
            const lastMsg = messages[messages.length - 1];
            const unseenCount = messages.filter((m) => !m.read && m.senderId !== currentUserId).length;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  opacity: status === 'unmatched' ? 0.6 : 1,
                  transition: 'background var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div className="avatar-container">
                    <img
                      src={matchUser.photo}
                      alt={matchUser.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {matchUser.name}
                      </h4>
                      {lastMsg && (
                        <span style={{ fontSize: '11px', color: unseenCount > 0 ? '#2563EB' : 'var(--color-text-muted)', fontWeight: unseenCount > 0 ? 600 : 400 }}>
                          {lastMsg.sentAt}
                        </span>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '2px'
                    }}>
                      <p style={{
                        fontSize: '13px',
                        color: unseenCount > 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        fontWeight: unseenCount > 0 ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        paddingRight: '8px'
                      }}>
                        {status === 'unmatched' ? 'Unmatched • Read-only history' : lastMsg ? lastMsg.text : 'Connected! Start chatting'}
                      </p>

                      {/* Unseen Message Counter Badge at the Right End */}
                      {unseenCount > 0 && (
                        <span style={{
                          background: '#2563EB',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 700,
                          minWidth: '20px',
                          height: '20px',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 6px',
                          marginLeft: '8px',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.4)',
                          flexShrink: 0
                        }}>
                          {unseenCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94A3B8'
          }}>
            <MessageSquare size={32} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>
            No Active Chats Yet
          </h3>
          <p style={{ fontSize: '13px', maxWidth: '280px', lineHeight: '18px' }}>
            Chats unlock as soon as a connection request is accepted by both you and a nearby user.
          </p>
        </div>
      )}
    </div>
  );
}
