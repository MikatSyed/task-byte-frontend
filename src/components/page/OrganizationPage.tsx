"use client";
import { useOrganizationsQuery } from "@/redux/api/organizationApi";
import React, { useState } from "react";
import { FaPlus, FaBuilding, FaEye, FaCalendarAlt, FaUserShield, FaUsers, FaUserPlus } from "react-icons/fa";
import AddOrganizationModal from "../UI/AddOrganizationModal";
import InviteUsersModal from "../UI/InviteUsersModal"; 

const OrganizationPage = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState<boolean>(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  
  const { data, isLoading } = useOrganizationsQuery(undefined);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options).replace(/ /g, ", ");
  };

  const showAddModal = () => setIsAddModalVisible(true);
  const handleAddCancel = () => setIsAddModalVisible(false);
  const handleOrganizationAdded = () => setIsAddModalVisible(false);

  const showInviteModal = (org: any) => {
    setSelectedOrg(org);
    setIsInviteModalVisible(true);
  };
  const handleInviteCancel = () => setIsInviteModalVisible(false);

  return (
    <>
      {/* Modals */}
      <AddOrganizationModal
        title="Create a New Organization"
        visible={isAddModalVisible}
        onCancel={handleAddCancel}
        onOrganizationAdded={handleOrganizationAdded}
      />

      <InviteUsersModal 
        visible={isInviteModalVisible} 
        onCancel={handleInviteCancel} 
        organization={selectedOrg} 
      />

      <div className="container mx-auto p-5">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
           Organization List
          </h2>
          <button
            onClick={showAddModal}
            className="flex items-center bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <FaPlus className="mr-2" /> Add Organization
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <p className="text-center text-gray-600">Loading organizations...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.data?.map((org: any) => (
              <div
                key={org._id}
                className="bg-white shadow-md rounded-lg px-5 py-6 border border-gray-200 transition-transform transform hover:scale-105 flex flex-col justify-between h-[270px]"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{org.name}</h3>

                  {/* Admin Section */}
                  <div className="flex items-center mb-4">
                    <FaUserShield className="mr-2 text-blue-500" />
                    <span className="text-sm font-semibold text-gray-800">Owner:</span>
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {org.admin?.name || "Unknown"}
                    </span>
                  </div>

                  {/* Created At Section */}
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    <span>
                      <strong>Join At:</strong> {formatDate(org.createdAt)}
                    </span>
                  </div>

                  {/* Members Section */}
                  <div className="flex items-center space-x-2 ">
                    <FaUsers className="text-blue-500" />
                    <span className="text-sm font-semibold text-gray-800">Team:</span>
                    {org.members.length > 0 ? (
                      <div className="flex -space-x-2">
                        {org.members.slice(0, 3).map((member: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-center bg-blue-500 text-white text-xs font-semibold w-8 h-8 rounded-full border-2 border-white"
                          >
                            {member.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {org.members.length > 3 && (
                          <div className="flex items-center justify-center bg-gray-300 text-gray-800 text-xs font-semibold w-8 h-8 rounded-full border-2 border-white">
                            +{org.members.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No Members</span>
                    )}
                  </div>
                </div>

                {/* Buttons (Fixed Position) */}
                <div className="flex space-x-2 mt-auto">
                  <button className="flex-1 flex items-center justify-center bg-[#2563eb] hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded h-10">
                    <FaEye className="mr-2" /> View
                  </button>
                  <button 
                    onClick={() => showInviteModal(org)}
                    className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded h-10"
                  >
                    <FaUserPlus className="mr-2" /> Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrganizationPage;
