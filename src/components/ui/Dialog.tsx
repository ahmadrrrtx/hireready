// ============================================================
// UI COMPONENT: GLASSMORPHIC DIALOG
// Translucent modals with backdrop blur
// ============================================================

import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={cn(
          'relative glass rounded-2xl shadow-2xl neon-border',
          'w-full overflow-hidden animate-fade-in',
          sizes[size]
        )}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg glass-hover text-gray-400 hover:text-white z-10"
            aria-label="Close dialog"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-white/10">
            {title && (
              <h2 className="text-2xl font-bold text-gradient mb-1">{title}</h2>
            )}
            {description && (
              <p className="text-gray-400 text-sm">{description}</p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;

// Dialog action buttons wrapper
export const DialogActions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 mt-6">
    {children}
  </div>
);
