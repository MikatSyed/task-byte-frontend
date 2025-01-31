"use client"
import Sidebar from '@/components/UI/Sidebar';
import Topbar from '@/components/UI/Topbar';
import React, { useState, ReactNode } from 'react';




// Define the type for the props
interface DashboardLayoutProps {
  children: ReactNode; 
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div>
      <div className="flex h-screen bg-gray-100 main">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-transform duration-300`}>
          <Topbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

          <main className="flex-1 p-4 overflow-y-auto">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
