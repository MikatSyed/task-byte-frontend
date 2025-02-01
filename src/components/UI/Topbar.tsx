// src/components/Topbar.tsx
import { useTaskForUserQuery } from '@/redux/api/taskApi';
import { useLoggedUserQuery } from '@/redux/api/userApi';
import Link from 'next/link';  // Import Link for navigation
import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { IoIosNotifications } from 'react-icons/io';
import { useClickAway } from 'react-use';
import { removeUserInfo } from '../../../services/auth.service';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const { push } = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false); 
  const [showAllNotifications, setShowAllNotifications] = useState<boolean>(false); 
  const [notificationCount, setNotificationCount] = useState<number>(0); 
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const notificationsMenuRef = useRef<HTMLDivElement | null>(null); 
  const { data } = useLoggedUserQuery(undefined);
  const user = data?.data;

  const { data: taskData, isLoading } = useTaskForUserQuery(undefined);


  const getTaskNotifications = () => {
    const notifications:any = [];

    if (taskData) {
      const currentTime = new Date();
      taskData.data.forEach((task:any) => {
        const dueDate = new Date(task.dueDate);
        const timeDifference = dueDate.getTime() - currentTime.getTime();
        const hoursLeft = timeDifference / (1000 * 3600); 
        if (hoursLeft <= 24 && hoursLeft > 0) {
          notifications.push({
            id: task._id,
            text: `Reminder: Task "${task.title}" is due soon.`,
            time: `${Math.ceil(hoursLeft)} hours left.`,
          });
        }
      });
    }

    return notifications;
  };

  const notifications = getTaskNotifications();

 
  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  useClickAway(profileMenuRef, () => setIsProfileOpen(false));
  useClickAway(notificationsMenuRef, () => setIsNotificationsOpen(false));

  const toggleProfileMenu = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const toggleNotificationsMenu = () => {
    setIsNotificationsOpen((prev) => !prev); 
    if (!isNotificationsOpen) {
      setNotificationCount(0); 
    }
  };

  const handleViewMoreClick = () => {
    setShowAllNotifications(true); 
  };

  const handleLogout = () => {
    removeUserInfo("accessToken");
    push("/login")
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <button className="mr-3 md:hidden" onClick={onToggleSidebar}>
            {isSidebarOpen ? <FiX className="w-7 h-7 text-blue-600" /> : <FiMenu className="w-7 h-7 text-blue-600" />}
          </button>
        </div>

        <div className="flex items-center space-x-4 mr-6">
          <div className="relative">
            <button
              onClick={toggleNotificationsMenu}
              className="p-2 rounded-full hover:text-blue-600 text-gray-500 flex items-center text-sm"
            >
              <IoIosNotifications className="mr-4 h-6 w-6" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div
                ref={notificationsMenuRef}
                className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto"
              >
                <div className="p-4 text-gray-800 text-lg font-semibold">Notifications</div>
                <div className="max-h-60 overflow-y-auto">
                 
                  {notifications.slice(0, showAllNotifications ? notifications.length : 7).map((notification:any) => (
                    <div
                      key={notification.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <span className="text-sm text-gray-600">{notification.text}</span>
                      <div className="text-xs text-gray-400">{notification.time}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200">
               
                  {!showAllNotifications && notifications.length > 7 && (
                    <button
                      onClick={handleViewMoreClick}
                      className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                    >
                      View More
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

     
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              ref={profileButtonRef}
              className="flex items-center space-x-2 focus:outline-none"
              tabIndex={0}
            >
              <div className="w-11 h-11 relative rounded-full overflow-hidden">
                <img
                  src="https://img.freepik.com/premium-photo/man-suit-with-white-shirt-black-tie_1153744-187667.jpg?semt=ais_hybrid"
                  alt="User"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
            </button>
            {isProfileOpen && (
              <div
                ref={profileMenuRef}
                className="absolute z-10 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <Link href="/dashboard/profile">
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </div>
                </Link>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
