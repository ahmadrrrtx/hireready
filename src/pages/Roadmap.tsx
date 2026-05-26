import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { useApp } from '../context/AppContext';
import { aiFallbackChain } from '../services/ai/fallback-chain';
import MindmapViewer from '../components/roadmaps/MindmapViewer';
import NodeDrawer from '../components/roadmaps/NodeDrawer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Roadmap: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { addToast } = useToast();
  const { addXP } = useApp();

  const [activeRoadmap, setActiveRoadmap] = useState<any>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Sync initial roadmap state from user profile
  useEffect(() => {
    if (profile?.active_roadmap) {
      try {
        const parsed = typeof profile.active_roadmap === 'string' 
          ? JSON.parse(profile.active_roadmap) 
          : profile.active_roadmap;
        setActiveRoadmap(parsed);
      } catch (e) {
        console.error('Failed to parse active roadmap:', e);
      }
    }
  }, [profile]);

  // Handle roadmap dynamic generation
  const handleGenerateRoadmap = async () => {
    if (!profile?.target_role) {
      addToast({
        type: 'warning',
        title: 'Select Career Path',
        message: 'Please set your target role in your profile to customize your roadmap.',
      });
      return;
    }

    setIsLoading(true);
    addToast({
      type: 'info',
      title: 'Generating Mindmap',
      message: 'Constructing your customizable learning milestones...',
    });

    const systemPrompt = `You are an elite Career Coach. Generate a comprehensive 3-Phase learning roadmap as a valid JSON object. Do not output markdown code blocks. Output ONLY valid, raw, parseable JSON mapping this schema:
    {
      "title": "Roadmap title",
      "phases": [
        {
          "title": "Phase 1: Foundations",
          "nodes": [
            {
              "id": "node-unique-id",
              "title": "Node title",
              "description": "Short explanation",
              "estimatedHours": 20,
              "courses": ["Matched Free Course 1", "Matched Free Course 2"],
              "tasks": ["Milestone task 1", "Milestone task 2"]
            }
          ]
        }
      ]
    }`;

    const userPrompt = `TARGET ROLE: ${profile.target_role}\nCURRENT SKILLS: ${profile.primary_skills?.join(', ') || 'None'}\nEXPERIENCE LEVEL: ${profile.years_experience || 'Beginner'}`;

    try {
      const response = await aiFallbackChain.generate({ systemPrompt, userPrompt });
      
      // Clean JSON blocks if the model outputs code markdown
      let cleanText = response.content.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
      }

      const generatedJSON = JSON.parse(cleanText);
      setActiveRoadmap(generatedJSON);
      await updateProfile({ active_roadmap: generatedJSON });
      addXP(150); // XP Reward!

      addToast({
        type: 'success',
        title: 'Roadmap Generated!',
        message: 'Your custom 3-Phase career mindmap is ready.',
      });
    } catch (err: any) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Failed to construct structured mindmap. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = (nodeData: any) => {
    setSelectedNode(nodeData);
    setIsDrawerOpen(true);
  };

  const handleMarkComplete = async (nodeId: string) => {
    if (!completedNodes.includes(nodeId)) {
      setCompletedNodes(prev => [...prev, nodeId]);
      addXP(50); // Small XP reward for milestone completion
      addToast({
        type: 'success',
        title: 'Milestone Completed!',
        message: 'Congratulations! You earned 50 XP!',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Row */}
      <div className="mb-6 flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-1">
            Interactive Career Roadmap
          </h1>
          <p className="text-gray-400 text-sm">
            AI-optimized, visual learning milestone tracker with linked free platforms
          </p>
        </div>
        {activeRoadmap && (
          <Button 
            onClick={handleGenerateRoadmap}
            isLoading={isLoading}
            variant="secondary"
          >
            Regenerate Path
          </Button>
        )}
      </div>

      {/* Main Canvas View */}
      <div className="flex-1 min-h-0 relative">
        {activeRoadmap ? (
          <MindmapViewer
            roadmapData={activeRoadmap}
            onNodeClick={handleNodeClick}
            completedNodes={completedNodes}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card variant="bordered" className="max-w-md w-full text-center p-8 animate-float">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Active Roadmap</h2>
              <p className="text-gray-400 text-sm mb-6">
                Create an AI-customized learning journey tailored directly to your target role and skill level.
              </p>
              <Button
                onClick={handleGenerateRoadmap}
                isLoading={isLoading}
                variant="primary"
                fullWidth
              >
                Generate My Roadmap
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Sliding Side panel drawer */}
      <NodeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        nodeData={selectedNode}
        onMarkComplete={handleMarkComplete}
        isCompleted={selectedNode ? completedNodes.includes(selectedNode.id) : false}
      />
    </div>
  );
};

export default Roadmap;
