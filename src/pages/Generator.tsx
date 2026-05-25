// ============================================================
// PAGE: PROJECT GENERATOR
// Multi-step wizard for generating portfolio project ideas
// ============================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { ProjectIdea, ProjectGenerationParams } from '../types';
import { CAREER_PATHS, POPULAR_SKILLS } from '../config/constants';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import ProjectCard from '../components/projects/ProjectCard';

const Generator: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { generate, save, isGenerating } = useProjects();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectGenerationParams>({
    skills: profile?.primarySkills || [],
    targetRole: profile?.targetRole || '',
    experience: profile?.yearsExperience || 0,
    interests: [],
    numProjects: 3,
  });
  const [generatedProjects, setGeneratedProjects] = useState<ProjectIdea[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile?.primarySkills || []);
  const [customSkill, setCustomSkill] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleGenerate = async () => {
    try {
      const params: ProjectGenerationParams = {
        ...formData,
        skills: selectedSkills,
      };

      const projects = await generate(params);
      setGeneratedProjects(projects);
      setStep(3);

      addToast({
        type: 'success',
        title: 'Projects Generated!',
        message: `${projects.length} portfolio ideas created just for you.`,
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: error.message || 'Failed to generate projects. Please try again.',
      });
    }
  };

  const handleSaveProject = async (project: ProjectIdea) => {
    try {
      await save(project);
      addToast({
        type: 'success',
        title: 'Project Saved!',
        message: `${project.title} has been added to your portfolio.`,
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">
          Portfolio Project Generator
        </h1>
        <p className="text-gray-400">
          AI-powered project ideas tailored to your skills and career goals
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                  step >= s
                    ? 'gradient-primary text-white neon-border'
                    : 'glass text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 w-20 rounded-full transition-all ${
                    step > s ? 'gradient-primary' : 'bg-gray-800'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 max-w-md mx-auto text-xs text-gray-500">
          <span>Skills</span>
          <span>Details</span>
          <span>Generate</span>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Skills Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="bordered" className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Select Your Skills</CardTitle>
                <CardDescription>
                  Choose the technologies and skills you want to showcase
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Popular Skills */}
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-3">Popular Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SKILLS.slice(0, 30).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedSkills.includes(skill)
                            ? 'gradient-primary text-white neon-border'
                            : 'glass-hover text-gray-400'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Skill Input */}
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-3">Add Custom Skill</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                      placeholder="e.g., Rust, Solidity, etc."
                      className="glass-input flex-1"
                    />
                    <Button onClick={addCustomSkill} variant="secondary">
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-3">
                      Selected ({selectedSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="glass px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-purple-500/30"
                        >
                          {skill}
                          <button
                            onClick={() => toggleSkill(skill)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={selectedSkills.length === 0}
                    variant="primary"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Career Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="bordered" className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Career Details</CardTitle>
                <CardDescription>
                  Help us tailor projects to your career goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Target Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Role
                    </label>
                    <select
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                      className="glass-input w-full"
                    >
                      <option value="">Select a role...</option>
                      {CAREER_PATHS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Years of Experience: {formData.experience}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Beginner</span>
                      <span>Mid-Level</span>
                      <span>Senior</span>
                    </div>
                  </div>

                  {/* Number of Projects */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Projects: {formData.numProjects}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.numProjects}
                      onChange={(e) =>
                        setFormData({ ...formData, numProjects: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button onClick={() => setStep(1)} variant="ghost">
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!formData.targetRole}
                    isLoading={isGenerating}
                    variant="primary"
                  >
                    Generate Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Generated Projects */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gradient">Your Project Ideas</h2>
                <p className="text-sm text-gray-400">
                  {generatedProjects.length} personalized portfolio projects
                </p>
              </div>
              <Button onClick={() => setStep(1)} variant="ghost">
                Generate More
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {generatedProjects.map((project, idx) => (
                <ProjectCard
                  key={idx}
                  project={project}
                  onSave={() => handleSaveProject(project)}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button onClick={() => navigate('/dashboard')} variant="primary" size="lg">
                Go to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Generator;
