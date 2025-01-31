// components/UI/CustomToast.tsx
import { toast } from 'react-hot-toast';
import { TiTickOutline } from 'react-icons/ti';
import React from 'react';

interface ToastOptions {
  message: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  duration?: number;
}

export const ShowToast = ({ message, style, duration = 2000 }: ToastOptions) => {
  toast(message, {
    icon:  <span style={{ marginRight: -8, fontSize: 22 }}><TiTickOutline /></span>,
    style: {
      borderRadius: '10px',
      background: '#2563eb',
      color: '#fff',
      ...style,
    },
    duration,
  });
};

