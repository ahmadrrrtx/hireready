// ============================================================
// UI COMPONENT: GLASSMORPHIC PROGRESS BAR
// Glowing linear progress indicators
// ============================================================

import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = 'primary',
      size = 'md',
      showLabel = false,
      animated = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const variants = {
      primary: 'from-purple-600 to-indigo-600',
      success: 'from-green-600 to-emerald-600',
      warning: 'from-orange-600 to-yellow-600',
      danger: 'from-red-600 to-pink-600',
    };

    return (
      <div ref={ref} className={cn('relative w-full', className)} {...props}>
        {/* Background track */}
        <div
          className={cn(
            'w-full rounded-full bg-gray-800/50 border border-white/5 overflow-hidden',
            sizes[size]
          )}
        >
          {/* Progress fill */}
          <div
            className={cn(
              'h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out',
              variants[variant],
              animated && 'animate-shimmer'
            )}
            style={{ width: `${percentage}%` }}
          >
            {/* Glow effect */}
            <div className="w-full h-full opacity-50 bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
        </div>

        {/* Label */}
        {showLabel && (
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>{Math.round(percentage)}%</span>
            <span>
              {value} / {max}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export default Progress;

// Circular progress variant
export const CircularProgress: React.FC<{
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}> = ({ value, max = 100, size = 120, strokeWidth = 8, className }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(147, 51, 234)" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gradient">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};
