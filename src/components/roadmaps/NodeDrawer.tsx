import React from 'react';
import { X, Clock, BookOpen, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface NodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: {
    id: string;
    title: string;
    description: string;
    estimatedHours: number;
    courses: string[];
    tasks: string[];
  } | null;
  onMarkComplete: (nodeId: string) => void;
  isCompleted: boolean;
}

const NodeDrawer: React.FC<NodeDrawerProps> = ({
  isOpen,
  onClose,
  nodeData,
  onMarkComplete,
  isCompleted,
}) => {
  if (!isOpen || !nodeData) return null;

  return (
    <>
      {/* Drawer Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-950/95 border-l border-purple-500/10 backdrop-blur-2xl z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-right">
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6 border-b border-purple-500/10 pb-4">
            <h3 className="text-xl font-bold text-gradient">{nodeData.title}</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg glass-hover text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              {nodeData.description}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mb-6 glass-satin p-4 rounded-xl border border-purple-500/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-300">
                {nodeData.estimatedHours} Hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-gray-300">
                {nodeData.courses.length} Free Resources
              </span>
            </div>
          </div>

          {/* Collapsible Free Courses */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Matched Free Courses</h4>
            <div className="space-y-3">
              {nodeData.courses.map((course, idx) => (
                <div 
                  key={idx}
                  className="glass-satin p-3.5 rounded-lg border border-purple-500/5 hover:border-purple-500/20 transition-all flex items-center justify-between"
                >
                  <span className="text-xs text-gray-300 font-medium truncate pr-4">
                    {course}
                  </span>
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(course + " free certificate")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex-shrink-0"
                  >
                    Go Study →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Required Practical Milestones */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Milestone Tasks</h4>
            <div className="space-y-3">
              {nodeData.tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call-to-Action Bottom Trigger */}
        <div className="border-t border-purple-500/10 pt-4 mt-6">
          {isCompleted ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold text-sm">
              <CheckCircle className="w-5 h-5" />
              Milestone Completed!
            </div>
          ) : (
            <Button
              onClick={() => {
                onMarkComplete(nodeData.id);
                onClose();
              }}
              variant="primary"
              fullWidth
            >
              Complete Milestone
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default NodeDrawer;
