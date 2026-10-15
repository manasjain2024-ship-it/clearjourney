import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none min-h-[48px]';

  const variants = {
    primary: 'bg-sage-700 text-white hover:bg-sage-800 shadow-sm active:bg-sage-900',
    secondary: 'bg-mint-100 text-sage-900 hover:bg-mint-200 active:bg-mint-500/20',
    outline: 'border-2 border-sage-700/20 text-sage-800 hover:bg-sage-50 active:border-sage-700/40',
    danger: 'bg-coral text-white hover:bg-red-700 active:bg-red-800',
    ghost: 'text-charcoal-700 hover:bg-charcoal-50 active:bg-charcoal-100',
  };

  const sizes = {
    sm: 'text-xs px-3 py-2 min-h-[40px]',
    md: 'text-sm px-4 py-3',
    lg: 'text-base px-6 py-3.5',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
