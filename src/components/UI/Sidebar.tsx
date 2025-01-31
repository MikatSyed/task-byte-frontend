"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MdDashboard, MdNotifications, MdTask, MdExitToApp, MdBusiness, MdSettings } from "react-icons/md"
import { FiCheckSquare, FiX } from "react-icons/fi"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { push } = useRouter()
  const [activeItem, setActiveItem] = useState<string>("dashboard")

  const handleLogout = () => {
    push("/")
  }

  const handleItemClick = (item: string) => {
    setActiveItem(item)
    if (isOpen) {
      onToggle()
    }
  }

  return (
    <div
      className={`fixed md:relative inset-y-0 left-0 w-72 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-xl transition-transform duration-300 transform ${
        isOpen ? "translate-x-0 z-50" : "-translate-x-full z-40"
      } md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="text-center py-8 px-6 relative">
          <h2 className="flex items-center justify-start space-x-3 text-3xl font-bold text-white">
            <FiCheckSquare className="text-white" size={36} />
            <span>TASK BYTE</span>
          </h2>
          <button onClick={onToggle} className="absolute top-8 right-6 text-white hover:text-gray-200 md:hidden">
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-8 flex-1 px-4">
          <ul className="space-y-2">
            {[
              { name: "Dashboard", icon: MdDashboard, href: "/dashboard" },
              { name: "Organization", icon: MdBusiness, href: "/dashboard/organization" },
              { name: "Tasks", icon: MdTask, href: "/tasks" },
              { name: "Notifications", icon: MdNotifications, href: "/notifications" },
              { name: "Settings", icon: MdSettings, href: "/settings" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeItem === item.name.toLowerCase()
                      ? "bg-white bg-opacity-20 text-white"
                      : "text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                  }`}
                  onClick={() => handleItemClick(item.name.toLowerCase())}
                >
                  <item.icon className="text-2xl mr-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6">
          <button
            className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-blue-50"
            onClick={handleLogout}
          >
            <MdExitToApp className="text-xl mr-2" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar