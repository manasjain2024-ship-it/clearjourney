import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-sage-100 p-4 shadow-clinical ${
        hoverEffect ? 'hover:border-sage-300 hover:shadow-md transition-all cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sage' | 'mint' | 'amber' | 'coral' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  size = 'md',
  className = '',
}) => {
  const variants = {
    sage: 'bg-sage-100 text-sage-800 border-sage-200',
    mint: 'bg-mint-100 text-emerald-800 border-mint-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    coral: 'bg-coral-50 text-coral-600 border-coral-200',
    neutral: 'bg-charcoal-50 text-charcoal-700 border-charcoal-200',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`bg-white rounded-3xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl border border-sage-100 p-5 transform transition-all animate-scaleUp`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-sage-100 mb-4">
          <h3 className="font-bold text-lg text-charcoal-800 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-sage-50 hover:bg-sage-100 text-charcoal-500 hover:text-charcoal-800 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: 'sage' | 'mint' | 'amber' | 'coral';
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'sage',
  height = 'h-2.5',
  className = '',
}) => {
  const colors = {
    sage: 'bg-sage-700',
    mint: 'bg-mint-500',
    amber: 'bg-amber-500',
    coral: 'bg-coral-500',
  };

  return (
    <div className={`w-full bg-sage-100/70 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className={`${colors[color]} h-full rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
