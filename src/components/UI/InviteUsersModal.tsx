import React, { useState } from "react";
import ReactModal from "react-modal";
import { CgClose } from "react-icons/cg";
import { useUsersQuery } from "@/redux/api/userApi";

interface InviteUsersModalProps {
  visible: boolean;
  onCancel: () => void;
  organization: any;
}

const InviteUsersModal: React.FC<InviteUsersModalProps> = ({ visible, onCancel, organization }) => {
  // Fetch the users from the API
  const { data, isLoading } = useUsersQuery(undefined);
  console.log(data,'15')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleInvite = () => {
    console.log(`Invited users: ${selectedUsers} to organization ${organization?.name}`);
    onCancel();
  };

  return (
    <ReactModal
      isOpen={visible}
      onRequestClose={onCancel}
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center p-5"
      className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg outline-none mt-10"
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Invite Users to {organization?.name}
        </h2>
        <button onClick={onCancel}>
          <CgClose className="text-[#2563eb]" size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {/* Render the users fetched from the API */}
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          data?.data?.map((user: any) => (
            <label key={user.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => toggleUserSelection(user.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <span>{user.name}</span>
            </label>
          ))
        )}
      </div>

      <button onClick={handleInvite} className="mt-4 w-full py-2 bg-[#2563eb] text-white font-semibold rounded hover:bg-blue-700">
        Send Invites
      </button>
    </ReactModal>
  );
};

export default InviteUsersModal;
