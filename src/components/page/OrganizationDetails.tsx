"use client"

import type React from "react"
import { useOrganizationQuery } from "@/redux/api/organizationApi"
import { FaBuilding, FaUserTie, FaUsers, FaCalendarAlt, FaClock, FaPlus, FaEnvelope } from "react-icons/fa"
import { useState } from "react"
import TaskCard from "../UI/TaskCard"
import AddTaskModal from "../UI/AddTaskModal"

interface OrganizationDetailsProps {
  id: string
}

const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({ id }) => { 
  const[isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { data, isLoading, isError } = useOrganizationQuery(id)

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading organization details</div>
  }

  const org = data?.data

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRandomColor = () => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-pink-500"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <AddTaskModal
        title="Create a New Task"
        visible={isModalVisible}
        onCancel={handleCancel}
        organizationId={id}
        
      />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <div className=" rounded-2xl overflow-hidden ">
          {/* Organization Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 sm:px-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <h1 className="text-4xl font-bold text-white flex items-center">
                <FaBuilding className="mr-4 text-blue-200" />
                {org.name}
              </h1>
              <button onClick={showModal} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  ">
                <FaPlus className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                Add Task
              </button>
            </div>
          </div>

        
          <div className=" py-10 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6 bg-gray-50 p-6 rounded-xl ">
                <div className="flex items-center text-gray-700">
                  <FaCalendarAlt className="mr-3 text-blue-600 text-xl" />
                  <span className="font-semibold mr-2 text-gray-900">Created:</span>
                  <span className="text-gray-600">{formatDate(org.createdAt)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaClock className="mr-3 text-blue-600 text-xl" />
                  <span className="font-semibold mr-2 text-gray-900">Last Updated:</span>
                  <span className="text-gray-600">{formatDate(org.updatedAt)}</span>
                </div>
              </div>

              {/* Admin Details */}
              <div className="bg-blue-50 p-6 rounded-xl ">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUserTie className="mr-3 text-blue-600" />
                  Admin
                </h2>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold text-gray-900">Name:</span> {org.admin.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">Email:</span> {org.admin.email}
                </p>
              </div>
            </div>

            {/* Members List */}
            <div className="mt-12">
              <h2 className="text-3xl font-semibold text-gray-800 mb-8 flex items-center">
                <FaUsers className="mr-3 text-blue-600" />
                Members
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {org.members.map((member) => (
                  <div
                    key={member._id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200  transition-all duration-300  hover:scale-105"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`${getRandomColor()} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold `}
                        >
                          {getInitials(member.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{member.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center truncate">
                            <FaEnvelope className="mr-2 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
             <div className="mt-12">
            <TaskCard id={id}/>
            </div>
           
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default OrganizationDetails

