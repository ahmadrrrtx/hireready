// ============================================================
// COMPONENT: CUSTOM NODE
// Styled roadmap node for React Flow
// ============================================================

import React from 'react';
import { Handle, Position } from 'reactflow';
import { CustomNodeData } from '../../types';
import { cn } from '../../utils/cn';

const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  const phaseColors: Record<string, string> = {
    Foundation: 'from-blue-600 to-blue-500',
    'Skill Building': 'from-purple-600 to-purple-500',
    'Project Development': 'from-pink-600 to-pink-500',
    Specialization: 'from-indigo-600 to-indigo-500',
    'Job Ready': 'from-green-600 to-green-500',
    'Continuous Growth': 'from-yellow-600 to-yellow-500',
  };

  const typeIcons: Record<string, string> = {
    phase: '🎯',
    skill: '📚',
    project: '💻',
    certification: '🏆',
    milestone: '⭐',
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg glass border min-w-[200px] transition-all',
        data.isCompleted ? 'border-green-500/50 bg-green-900/10' : 'border-purple-500/30',
        'hover:scale-105 cursor-pointer'
      )}
      onClick={() => data.onExpand?.(data.id)}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-lg">{typeIcons[data.type] || '📌'}</span>
        {data.isCompleted && (
          <span className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
        {data.title}
      </h3>

      {/* Phase Badge */}
      <div
        className={cn(
          'inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r',
          phaseColors[data.phase] || 'from-gray-600 to-gray-500',
          'text-white mb-2'
        )}
      >
        {data.phase}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          {data.estimatedDays}d
        </span>
        {data.skills.length > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            {data.skills.length}
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
    </div>
  );
};

export default CustomNode;
