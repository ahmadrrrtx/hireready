// ============================================================
// PAGE: DASHBOARD
// Main overview with stats, progress, and quick actions
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useRoadmap } from '../hooks/useRoadmap';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Progress, { CircularProgress } from '../components/ui/Progress';
import ProjectCard from '../components/projects/ProjectCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { projects } = useProjects();
  const { activeRoadmap } = useRoadmap();

  const completedProjects = projects.filter(p => p.isCompleted).length;
  const totalProjects = projects.length;
  const projectCompletionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Welcome back, {profile?.fullName || 'Developer'}! 👋
        </h1>
        <p className="text-gray-400">
          Here's your career development overview
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="bordered" hover>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center neon-border">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {completedProjects}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card variant="bordered" hover>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Projects</p>
                  <p className="text-2xl font-bold text-white">
                    {totalProjects}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card variant="bordered" hover>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Day Streak</p>
                  <p className="text-2xl font-bold text-white">
                    {profile?.streakDays || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card variant="bordered" hover>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CircularProgress value={activeRoadmap?.progressPercentage || 0} size={48} strokeWidth={4} />
                <div>
                  <p className="text-sm text-gray-400">Roadmap</p>
                  <p className="text-2xl font-bold text-white">
                    {activeRoadmap?.progressPercentage || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card variant="bordered" hover className="cursor-pointer" onClick={() => navigate('/generator')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 neon-border">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Generate Projects</h3>
            <p className="text-sm text-gray-400">Get AI-powered project ideas</p>
          </CardContent>
        </Card>

        <Card variant="bordered" hover className="cursor-pointer" onClick={() => navigate('/roadmap')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">View Roadmap</h3>
            <p className="text-sm text-gray-400">Track your learning path</p>
          </CardContent>
        </Card>

        <Card variant="bordered" hover className="cursor-pointer" onClick={() => navigate('/certify')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Get Certified</h3>
            <p className="text-sm text-gray-400">Take assessment quiz</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gradient">Recent Projects</h2>
            <Button onClick={() => navigate('/generator')} variant="ghost">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recentProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
              >
                <ProjectCard
                  project={project.projectData}
                  isCompleted={project.isCompleted}
                  isSaved
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalProjects === 0 && (
        <Card variant="bordered" className="text-center">
          <CardContent className="p-12">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6">
              Start by generating AI-powered project ideas tailored to your skills
            </p>
            <Button onClick={() => navigate('/generator')} variant="primary">
              Generate Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
