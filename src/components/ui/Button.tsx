// ============================================================
// UI COMPONENT: GLASSMORPHIC BUTTON
// Transparent glowing buttons with loading states
// ============================================================

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-all duration-300 outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      fullWidth && 'w-full'
    );

    const variants = {
      primary: cn(
        'glass neon-border text-white',
        'hover:bg-purple-600/20 hover:scale-105',
        'active:scale-95',
        'focus-visible:outline-purple-500'
      ),
      secondary: cn(
        'glass border-indigo-500/50 text-white',
        'hover:bg-indigo-600/20 hover:border-indigo-400/70',
        'active:scale-95',
        'focus-visible:outline-indigo-500'
      ),
      ghost: cn(
        'bg-transparent border border-transparent text-gray-300',
        'hover:bg-white/5 hover:text-white',
        'active:bg-white/10',
        'focus-visible:outline-gray-400'
      ),
      danger: cn(
        'glass border-red-500/50 text-white',
        'hover:bg-red-600/20 hover:border-red-400/70',
        'active:scale-95',
        'focus-visible:outline-red-500'
      ),
      success: cn(
        'glass border-green-500/50 text-white',
        'hover:bg-green-600/20 hover:border-green-400/70',
        'active:scale-95',
        'focus-visible:outline-green-500'
      ),
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5 min-h-[32px]',
      md: 'text-base px-5 py-2.5 min-h-[40px]',
      lg: 'text-lg px-6 py-3 min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="spinner" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
