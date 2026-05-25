// ============================================================
// LAYOUT: APPLICATION SHELL
// Master dashboard grid layout with sidebar and navbar
// ============================================================

import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Navbar */}
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

        {/* Main content area */}
        <main
          className={cn(
            'flex-1 overflow-y-auto transition-all duration-300',
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          )}
        >
          <div className="container-custom py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default AppShell;
