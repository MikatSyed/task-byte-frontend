"use client";
import { useInvitationsQuery, useUpdateInvitationMutation } from "@/redux/api/invitationApi";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi";
import { ShowToast } from "../UI/ShowToast";

const InvitationPage = () => {
  // Fetch invitations data from the API
  const { data, isLoading, isError, refetch } = useInvitationsQuery(undefined);
  const [updateInvitation, { isLoading: isUpdating }] = useUpdateInvitationMutation();

  // Function to handle status update
  const handleUpdateStatus = async (inviteId: string, status: "accepted" | "rejected") => {
    const toastId = toast.loading("Updating...")
    try {
      await updateInvitation({ id: inviteId, body:{status} }).unwrap();
      ShowToast({message:"Status Updated Successfully!"})
    } catch (error) {
      console.error("Error updating invitation:", error);
    }finally{
        toast.dismiss(toastId)
    }
  };

  // If data is loading or error, display loading or error messages
  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading invitations</div>;

  return (
   <>
    <Toaster position="top-center" reverseOrder={false} />
    <div className="container mx-auto p-5 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Invitations</h2>
      </div>

      {/* Check if no data exists */}
      {data?.data?.length === 0 ? (
        <div className="text-center text-gray-500">No invitations available</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Organization</th>
              <th className="border p-3 text-left">Sender</th>
              <th className="border p-3 text-center">Status</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((invite: any) => (
              <tr key={invite._id} className="border">
                <td className="border p-3">{invite.organizationName}</td>
                <td className="border p-3">{invite.invitedUser}</td>
                <td className="border p-3 text-center">
                  <span
                    className={`px-3 py-1 text-white rounded-full ${
                      invite.status === "pending"
                        ? "bg-yellow-500"
                        : invite.status === "accepted"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {invite.status}
                  </span>
                </td>
                <td className="border p-3 text-center">
                  <div className="flex justify-center space-x-2">
                    {invite.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(invite._id, "accepted")}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                          disabled={isUpdating}
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(invite._id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                          disabled={isUpdating}
                        >
                          <FiX />
                        </button>
                      </>
                    )}
                    {invite.status === "accepted" && (
                      <span className="bg-[#2563eb] text-white px-3 py-1 rounded-lg">
                        View
                      </span>
                    )}
                    {invite.status === "rejected" && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-lg">
                        Rejected
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
   </>
  );
};

export default InvitationPage;
