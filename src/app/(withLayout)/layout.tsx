"use client"
import Sidebar from '@/components/UI/Sidebar';
import Topbar from '@/components/UI/Topbar';
import { useRouter } from 'next/navigation';
import React, { useState, ReactNode, useEffect } from 'react';
import { isLoggedIn } from '../../../services/auth.service';




// Define the type for the props
interface DashboardLayoutProps {
  children: ReactNode; 
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router  = useRouter()
  const userLoggedIn = isLoggedIn();
  console.log(userLoggedIn,'19')
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userLoggedIn) {
      router.push("/login");
    }
    setIsLoading(true);
  }, [router, isLoading]);
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
