// ============================================================
// COMPONENT: SIGNAL PILL
// Floating badge for recruiter signals
// ============================================================

import React from 'react';
import { RecruiterSignal } from '../../types';
import { cn } from '../../utils/cn';

interface SignalPillProps {
  signal: RecruiterSignal;
  className?: string;
}

const SignalPill: React.FC<SignalPillProps> = ({ signal, className }) => {
  const signalConfig: Record<RecruiterSignal, { icon: string; color: string }> = {
    'Production Thinking': { icon: '🚀', color: 'from-purple-600 to-purple-500' },
    'System Design': { icon: '⚙️', color: 'from-blue-600 to-blue-500' },
    'User Empathy': { icon: '❤️', color: 'from-pink-600 to-pink-500' },
    'Technical Depth': { icon: '🔬', color: 'from-indigo-600 to-indigo-500' },
    'Innovation': { icon: '💡', color: 'from-yellow-600 to-yellow-500' },
    'Scalability': { icon: '📈', color: 'from-green-600 to-green-500' },
  };

  const config = signalConfig[signal];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        'glass border border-white/20 text-white',
        'bg-gradient-to-r',
        config.color,
        className
      )}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{signal}</span>
    </span>
  );
};

export default SignalPill;
