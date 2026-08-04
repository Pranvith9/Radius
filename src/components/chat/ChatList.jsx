import React, { useState } from 'react';
import { MessageSquare, Search, X } from 'lucide-react';

export default function ChatList({ chats, onSelectChat, currentUserId = 'usr_000' }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = chat.matchUser?.name?.toLowerCase().includes(query);
    const lastMsg = chat.messages[chat.messages.length - 1];
    const msgMatch = lastMsg?.text?.toLowerCase().includes(query);
    return nameMatch || msgMatch;
  });

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      background: 'var(--neptune-bg-warm)'
    }}>
      {/* Search Bar */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        padding: '8px 12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Search size={16} color="var(--color-text-muted)" style={{ marginRight: '8px', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search chats by name or message..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '13px',
            color: 'var(--color-text-primary)'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-text-muted)'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {chats.length > 0 ? (
        filteredChats.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredChats.map((chat) => {
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
            textAlign: 'center',
            padding: '30px 16px',
            color: 'var(--color-text-secondary)',
            fontSize: '13px'
          }}>
            No conversations matching "{searchQuery}"
          </div>
        )
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
          color: 'var(--color-text-secondary)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#F5F5F4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)'
          }}>
            <MessageSquare size={32} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            No Active Conversations
          </h3>
          <p style={{ fontSize: '13px', maxWidth: '280px', lineHeight: '18px' }}>
            When you accept connection requests, your chat threads will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
