"use client";

import React, { useState } from "react";
import { useTaskForUserQuery, useUpdateTaskMutation } from "@/redux/api/taskApi";
import { FiUser, FiClock, FiBriefcase } from "react-icons/fi";
import { BiBookmark } from "react-icons/bi";
import { FaBookmark } from "react-icons/fa";

const TaskPage = () => {
    const { data, isLoading } = useTaskForUserQuery(undefined);
    const tasks = data?.data || [];

    const [updateTask] = useUpdateTaskMutation();
    const [localStatuses, setLocalStatuses] = useState({}); // Handle UI toggle state

    // Function to toggle status instantly and then update API
    const handleToggleStatus = async (task) => {
        const newStatus = task.status === "in-progress" ? "completed" : "in-progress";

        // **Instant UI update**
        setLocalStatuses((prev) => ({
            ...prev,
            [task._id]: newStatus,
        }));

        try {
            // **Update API in the background**
            await updateTask({ id: task._id, body: { status: newStatus } }).unwrap();
        } catch (error) {
            console.error("Error updating task status:", error);

            // **Revert UI if API fails**
            setLocalStatuses((prev) => ({
                ...prev,
                [task._id]: task.status, // Reset to original state
            }));
        }
    };

    if (isLoading) {
        return <p className="text-center text-gray-600 text-lg">Loading tasks...</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
            {tasks.length > 0 ? (
                tasks.map((task) => {
                    const currentStatus = localStatuses[task._id] ?? task.status; // Use local state if available

                    return (
                        <div
                            key={task._id}
                            className="bg-white rounded-lg border border-gray-100 p-4 relative hover:shadow-lg"
                        >
                            <div className="flex flex-row justify-between items-start mb-5">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    {task.title}
                                </h3>

                                {/* Toggle Bookmark Icon */}
                                <div className="cursor-pointer" onClick={() => handleToggleStatus(task)}>
                                    {currentStatus === "completed" ? (
                                        <FaBookmark size={28} className="text-blue-600 hover:text-blue-800" />
                                    ) : (
                                        <BiBookmark size={28} className="text-gray-500 hover:text-gray-700" />
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6 text-base leading-relaxed">
                                {task.description}
                            </p>

                            <div>
                                <p className="text-base text-gray-700 font-semibold flex items-center mb-3">
                                    <FiUser className="mr-2 text-[#2255d3]" />
                                    Assign To:
                                    <span className="text-gray-600 font-normal ml-2">
                                        {task.assignedTo.length > 0
                                            ? task.assignedTo.map((user) => user.name).join(", ")
                                            : "Unassigned"}
                                    </span>
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-base text-gray-700 font-semibold flex items-center mb-3">
                                    <FiClock className="mr-2 text-[#2255d3]" />
                                    Due Date: <span className="text-gray-600 font-normal ml-2">
                                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-base text-gray-700 font-semibold flex items-center mb-3">
                                    <FiBriefcase className="mr-2 text-[#2255d3]" />
                                    Organization: <span className="text-gray-600 font-normal ml-2">
                                        {task?.organization?.name || "Not Available"}
                                    </span>
                                </p>
                            </div>

                            <div className="mb-6">
                                <p className="text-base text-gray-700 font-semibold flex items-center mb-3">
                                    <span className="mr-2 text-gray-600">Priority:</span>
                                    <span
                                        className={`rounded-full text-xs sm:text-sm px-2 py-1 ${
                                            task.priority === "high"
                                                ? "bg-red-500 text-white"
                                                : task.priority === "medium"
                                                ? "bg-yellow-500 text-white"
                                                : "bg-blue-500 text-white"
                                        }`}
                                    >
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-gray-600 text-lg">No tasks available.</p>
            )}
        </div>
    );
};

export default TaskPage;
