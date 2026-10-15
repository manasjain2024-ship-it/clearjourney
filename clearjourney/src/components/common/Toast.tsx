import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
}) => {
  const styles = {
    success: 'bg-sage-800 text-white border-sage-700',
    info: 'bg-charcoal-800 text-white border-charcoal-700',
    warning: 'bg-amber-600 text-white border-amber-500',
    error: 'bg-coral-600 text-white border-coral-500',
  };

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-medium border ${styles[type]} animate-slideUp`}
    >
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-75 hover:opacity-100 text-sm">
          ✕
        </button>
      )}
    </div>
  );
};
