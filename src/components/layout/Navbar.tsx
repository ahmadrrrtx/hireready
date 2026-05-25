// ============================================================
// LAYOUT: NAVBAR
// Top navigation with user menu and notifications
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { clearAllData } = useAppContext();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      clearAllData();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const streakDays = profile?.streakDays ?? 0;

  return (
    <nav className="h-16 glass border-b border-white/10 sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center neon-border group-hover:scale-110 transition-transform">
            <span className="text-xl font-bold">HR</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gradient">HireReady 2.0</h1>
            <p className="text-xs text-gray-500">Career OS</p>
          </div>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Streak counter */}
          {streakDays > 0 && (
            <div className="glass-card px-4 py-2 flex items-center gap-2 animate-glow-pulse">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-xs text-gray-400">Streak</p>
                <p className="text-sm font-bold text-orange-400">{streakDays} days</p>
              </div>
            </div>
          )}

          {/* Notifications (placeholder) */}
          <button className="p-2 rounded-lg glass-hover relative">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg glass-hover"
            >
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold">
                {profile?.fullName?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{profile?.fullName ?? 'User'}</p>
                <p className="text-xs text-gray-400">{profile?.targetRole ?? 'Set your role'}</p>
              </div>
              <svg
                className={cn(
                  'w-4 h-4 text-gray-400 transition-transform',
                  showUserMenu && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 glass rounded-lg border border-white/10 shadow-2xl z-20 animate-fade-in">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {profile?.yearsExperience ?? 0} years experience
                    </p>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 rounded-lg text-sm glass-hover"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 rounded-lg text-sm glass-hover"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                  </div>

                  <div className="p-2 border-t border-white/10">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 rounded-lg text-sm text-red-400 glass-hover text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
