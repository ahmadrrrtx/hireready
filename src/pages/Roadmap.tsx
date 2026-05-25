// ============================================================
// PAGE: CAREER ROADMAP
// Interactive mindmap dashboard
// ============================================================

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmap } from '../hooks/useRoadmap';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Progress from '../components/ui/Progress';
import MindmapViewer from '../components/roadmaps/MindmapViewer';

const Roadmap: React.FC = () => {
  const navigate = useNavigate();
  const { activeRoadmap, completeMilestone, isLoading } = useRoadmap();
  const { addToast } = useToast();

  const handleNodeComplete = async (nodeId: string) => {
    try {
      // Find the milestone ID from the node
      const milestone = activeRoadmap?.nodes.find(n => n.id === nodeId);
      if (!milestone) return;

      await completeMilestone(nodeId);
      
      addToast({
        type: 'success',
        title: 'Milestone Completed!',
        message: `Great job completing: ${milestone.title}`,
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Failed to Update',
        message: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner w-12 h-12 mb-4" />
          <p className="text-gray-400">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (!activeRoadmap) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card variant="bordered">
          <div className="p-12">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 neon-border">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gradient mb-2">
              No Active Roadmap
            </h2>
            <p className="text-gray-400 mb-6">
              Create a personalized career roadmap to track your learning journey
            </p>
            <Button onClick={() => navigate('/generator')} variant="primary" size="lg">
              Generate Roadmap
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">
          {activeRoadmap.title}
        </h1>
        <p className="text-gray-400">
          Your personalized path to becoming a {activeRoadmap.targetRole}
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-2xl font-bold text-gradient">
                  {activeRoadmap.progressPercentage}%
                </p>
              </div>
            </div>
            <Progress value={activeRoadmap.progressPercentage} variant="primary" />
          </div>
        </Card>

        <Card variant="bordered">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Milestones</p>
                <p className="text-2xl font-bold text-white">
                  {activeRoadmap.completedMilestones} / {activeRoadmap.totalMilestones}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="bordered">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Est. Time</p>
                <p className="text-2xl font-bold text-white">
                  {activeRoadmap.estimatedTotalDays} days
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Mindmap Viewer */}
      <Card variant="bordered" padding="none">
        <CardHeader className="p-6 border-b border-white/10">
          <CardTitle>Interactive Learning Path</CardTitle>
          <CardDescription>
            Click on any node to view details and access free learning resources
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <MindmapViewer
            nodes={activeRoadmap.nodes}
            onNodeComplete={handleNodeComplete}
          />
        </div>
      </Card>

      {/* Help Text */}
      <div className="mt-6 glass-card p-4 text-center">
        <p className="text-sm text-gray-400">
          💡 Drag nodes to reorganize, click to view details, and mark milestones complete as you progress
        </p>
      </div>
    </div>
  );
};

export default Roadmap;
