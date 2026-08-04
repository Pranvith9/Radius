import React from 'react';
import RequestCard from './RequestCard';
import { UserPlus, Inbox, ShieldCheck } from 'lucide-react';

export default function RequestsInbox({ requests, onAcceptRequest, onDeclineRequest, onBlockUser }) {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: 'var(--color-bg)'
    }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Connection Requests
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            People nearby who want to connect with you
          </p>
        </div>

        {requests.length > 0 && (
          <span style={{
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary-hover)',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid rgba(251, 146, 60, 0.3)'
          }}>
            {requests.length} Pending
          </span>
        )}
      </div>

      {/* Safety Notice */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12px',
        color: 'var(--color-text-secondary)'
      }}>
        <ShieldCheck size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Consent Enforcement:</strong> No user can message or call you until you accept their connection request.
        </span>
      </div>

      {/* Requests List or Empty State */}
      {requests.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={onAcceptRequest}
              onDecline={onDeclineRequest}
              onBlock={onBlockUser}
            />
          ))}
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
            <Inbox size={32} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            No Pending Requests
          </h3>
          <p style={{ fontSize: '13px', maxWidth: '280px', lineHeight: '18px' }}>
            When nearby users discover your profile and send a request, they'll show up here.
          </p>
        </div>
      )}
    </div>
  );
}
