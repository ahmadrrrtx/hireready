// ============================================================
// COMPONENT: NODE DRAWER
// Sliding side panel with node details and course resources
// ============================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoadmapNode } from '../../types';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

interface NodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node: RoadmapNode | null;
  onComplete?: (nodeId: string) => void;
}

const NodeDrawer: React.FC<NodeDrawerProps> = ({ isOpen, onClose, node, onComplete }) => {
  if (!node) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-white/10 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 glass border-b border-white/10 p-6 z-10">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-2xl font-bold text-gradient flex-1">
                  {node.title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg glass-hover text-gray-400 hover:text-white flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  node.isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500' : 'glass border border-purple-500/30'
                )}>
                  {node.phase}
                </span>
                <span className="text-sm text-gray-400">
                  {node.estimatedDays} days
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-purple-400 mb-2">
                  📋 Description
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {node.description}
                </p>
              </div>

              {/* Skills */}
              {node.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-indigo-400 mb-3">
                    🎯 Skills You'll Learn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {node.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg glass border border-indigo-500/30 text-sm text-indigo-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Resources */}
              {node.courseResources && node.courseResources.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-pink-400 mb-3">
                    📚 Free Learning Resources
                  </h3>
                  <div className="space-y-3">
                    {node.courseResources.map((course, idx) => (
                      <a
                        key={idx}
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block glass-card glass-hover p-4 border border-white/10"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="text-sm font-semibold text-white flex-1">
                            {course.title}
                          </h4>
                          <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {course.platform}
                          </span>
                          <span>{course.duration}</span>
                          {course.isFree && (
                            <span className="text-green-400">Free</span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Button */}
              {!node.isCompleted && onComplete && (
                <div className="pt-4 border-t border-white/10">
                  <Button
                    variant="success"
                    fullWidth
                    onClick={() => {
                      onComplete(node.id);
                      onClose();
                    }}
                  >
                    Mark as Complete
                  </Button>
                </div>
              )}

              {/* Completion Status */}
              {node.isCompleted && (
                <div className="glass-card p-4 border border-green-500/30 bg-green-900/10">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-green-400">Completed!</p>
                      <p className="text-xs text-gray-400">
                        {node.completedAt && new Date(node.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NodeDrawer;
