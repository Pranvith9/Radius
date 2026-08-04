import React from 'react';
import { Coffee, Compass, Music, BookOpen } from 'lucide-react';

export default function IcebreakerPrompts({ onSelectPrompt }) {
  const prompts = [
    { text: "What's your favorite local coffee or tea spot nearby?", icon: Coffee },
    { text: "What song is currently on repeat for you?", icon: Music },
    { text: "Recommend one book or podcast everyone should check out!", icon: BookOpen },
    { text: "Dog park, beach walk, or rooftop sunset?", icon: Compass }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      padding: '8px 12px',
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)'
    }}>
      {prompts.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.text)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Icon size={13} color="#2563EB" />
            <span>{item.text}</span>
          </button>
        );
      })}
    </div>
  );
}
