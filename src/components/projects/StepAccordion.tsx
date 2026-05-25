// ============================================================
// COMPONENT: STEP ACCORDION
// Collapsible implementation steps
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step } from '../../types';
import { cn } from '../../utils/cn';

interface StepAccordionProps {
  steps: Step[];
  className?: string;
}

const StepAccordion: React.FC<StepAccordionProps> = ({ steps, className }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {steps.map((step) => (
        <div key={step.stepNumber} className="glass rounded-lg overflow-hidden border border-white/10">
          {/* Step Header */}
          <button
            onClick={() => toggleStep(step.stepNumber)}
            className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 text-left flex-1">
              <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold">
                {step.stepNumber}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{step.title}</p>
                {step.estimatedHours && (
                  <p className="text-xs text-gray-500">~{step.estimatedHours}h</p>
                )}
              </div>
            </div>
            <svg
              className={cn(
                'w-5 h-5 text-gray-400 transition-transform flex-shrink-0',
                expandedStep === step.stepNumber && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Step Content */}
          <AnimatePresence>
            {expandedStep === step.stepNumber && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                  {/* Description */}
                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Technical Details */}
                  {step.technicalDetails && (
                    <div className="glass rounded-lg p-3 border border-purple-500/20">
                      <p className="text-xs text-purple-400 font-semibold mb-1">
                        Technical Details
                      </p>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {step.technicalDetails}
                      </p>
                    </div>
                  )}

                  {/* Key Learnings */}
                  {step.keyLearnings && step.keyLearnings.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-2">
                        Key Learnings
                      </p>
                      <ul className="space-y-1">
                        {step.keyLearnings.map((learning, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{learning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default StepAccordion;
