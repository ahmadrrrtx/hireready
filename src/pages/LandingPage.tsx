// ============================================================
// PAGE: LANDING
// Homepage with 3D particle animations
// ============================================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: '🎯',
      title: 'AI Project Generator',
      description: 'Get personalized portfolio project ideas that recruiters actually care about',
    },
    {
      icon: '🗺️',
      title: 'Interactive Roadmaps',
      description: 'Visual career paths with free courses and milestone tracking',
    },
    {
      icon: '🏆',
      title: 'Verifiable Certificates',
      description: 'Blockchain-style verification with QR codes for instant validation',
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Streaks, XP, and analytics to keep you motivated',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center neon-border">
              <span className="text-xl font-bold">HR</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">HireReady 2.0</h1>
              <p className="text-xs text-gray-500">Career OS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')} variant="primary">
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="ghost">
                  Login
                </Button>
                <Button onClick={() => navigate('/signup')} variant="primary">
                  Sign Up Free
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">The Ultimate</span>
            <br />
            <span className="text-white">AI-Powered Career OS</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Generate portfolio projects that get you hired. Build with AI-powered guidance,
            track your progress, and earn verifiable certificates.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => navigate(isAuthenticated ? '/generator' : '/signup')}
              variant="primary"
              size="lg"
            >
              Start Building Free
            </Button>
            <Button
              onClick={() => navigate('/verify')}
              variant="ghost"
              size="lg"
            >
              Verify Certificate
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-16">
            <div>
              <p className="text-3xl font-bold text-gradient">7</p>
              <p className="text-sm text-gray-500">AI Models</p>
            </div>
            <div className="w-px h-12 bg-gray-800" />
            <div>
              <p className="text-3xl font-bold text-gradient">300+</p>
              <p className="text-sm text-gray-500">Free Courses</p>
            </div>
            <div className="w-px h-12 bg-gray-800" />
            <div>
              <p className="text-3xl font-bold text-gradient">100%</p>
              <p className="text-sm text-gray-500">Free Forever</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-center text-gradient mb-12">
            Everything You Need to Land Your Dream Job
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
              >
                <Card variant="bordered" hover className="h-full text-center">
                  <div className="p-6">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <Card variant="bordered" glow className="text-center">
          <div className="p-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Ready to Build Your Future?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of developers building portfolios that get results
            </p>
            <Button
              onClick={() => navigate('/signup')}
              variant="primary"
              size="lg"
            >
              Get Started Free →
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2024 HireReady 2.0. Built with AI, designed for developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
