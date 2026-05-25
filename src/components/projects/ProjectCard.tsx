// ============================================================
// COMPONENT: PROJECT CARD
// Displays fit score, recruiter signals, and step guides
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectIdea } from '../../types';
import { cn } from '../../utils/cn';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { CircularProgress } from '../ui/Progress';
import SignalPill from './SignalPill';
import StepAccordion from './StepAccordion';

interface ProjectCardProps {
  project: ProjectIdea;
  onSave?: () => void;
  onComplete?: () => void;
  isSaved?: boolean;
  isCompleted?: boolean;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSave,
  onComplete,
  isSaved = false,
  isCompleted = false,
  className,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card variant="bordered" hover glow={project.fitScore >= 80} className="h-full">
        <CardContent>
          {/* Header with Fit Score */}
          <div className="flex items-start gap-4 mb-4">
            {/* Circular Fit Score */}
            <div className="flex-shrink-0">
              <CircularProgress
                value={project.fitScore}
                size={80}
                strokeWidth={6}
              />
            </div>

            {/* Title and Tagline */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-gradient mb-1">
                  {project.title}
                </h3>
                {isCompleted && (
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-3">{project.tagline}</p>

              {/* Recruiter Signals */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.recruiterSignals.map((signal, idx) => (
                  <SignalPill key={idx} signal={signal} />
                ))}
              </div>

              {/* Difficulty and Time */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {project.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {project.estimatedHours}h
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2 font-semibold">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {[
                ...(project.techStack.frontend || []),
                ...(project.techStack.backend || []),
                ...(project.techStack.database || []),
              ].slice(0, 6).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-md glass border border-indigo-500/30 text-indigo-300"
                >
                  {tech}
                </span>
              ))}
              {[
                ...(project.techStack.frontend || []),
                ...(project.techStack.backend || []),
                ...(project.techStack.database || []),
              ].length > 6 && (
                <span className="px-2 py-1 text-xs rounded-md glass text-gray-400">
                  +{[
                    ...(project.techStack.frontend || []),
                    ...(project.techStack.backend || []),
                    ...(project.techStack.database || []),
                  ].length - 6} more
                </span>
              )}
            </div>
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4 border-t border-white/10">
                  {/* Why Recruiters Care */}
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">
                      🎯 Why Recruiters Care
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.whyRecruitersCare}
                    </p>
                  </div>

                  {/* Market Relevance */}
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-400 mb-2">
                      📈 Market Relevance
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.marketRelevance}
                    </p>
                  </div>

                  {/* Portfolio Impact */}
                  <div>
                    <h4 className="text-sm font-semibold text-pink-400 mb-2">
                      💼 Portfolio Impact
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.portfolioImpact}
                    </p>
                  </div>

                  {/* Real World Context */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">
                      🌍 Real World Context
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.realWorldContext}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Implementation Steps */}
          <AnimatePresence>
            {showSteps && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4"
              >
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-purple-400 mb-3">
                    📋 Implementation Steps
                  </h4>
                  <StepAccordion steps={project.steps} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter>
          <div className="flex flex-wrap gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              fullWidth
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSteps(!showSteps)}
              fullWidth
            >
              {showSteps ? 'Hide Steps' : 'View Steps'}
            </Button>
            {onSave && !isSaved && (
              <Button variant="primary" size="sm" onClick={onSave} fullWidth>
                Save Project
              </Button>
            )}
            {onComplete && isSaved && !isCompleted && (
              <Button variant="success" size="sm" onClick={onComplete} fullWidth>
                Mark Complete
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
