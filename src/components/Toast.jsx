import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        padding: '12px 24px',
        borderRadius: '14px',
        background: '#1a1a1a',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '500',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        animation: 'slideUp .3s ease-out'
      }}
    >
      {message}
    </div>
  );
}
