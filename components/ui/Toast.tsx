'use client';

import React from 'react';

interface ToastProps {
  message: string | null;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  if (!message) return null;

  return (
    <div
      className={`fixed left-1/2 bottom-8 -translate-x-1/2 pill z-50 text-xs tracking-wider font-mono transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] shadow-2xl ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        color: '#14091F',
        border: '1px solid rgba(20, 9, 31, 0.2)',
      }}
    >
      {message}
    </div>
  );
}
