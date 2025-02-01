import { useState } from "react";
import { BiBookmark, BiEditAlt } from "react-icons/bi";
import { FaBookmark } from "react-icons/fa";
import { FiClock, FiUser } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import {
  useDeleteTaskMutation,
  useTaskByOrganizationQuery,
} from "@/redux/api/taskApi";
import UpdateTaskModal from "./UpdateTaskModal";
import { ShowToast } from "./ShowToast";

// Define Task Interface
interface Task {
  _id: string;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done";
  priority: "high" | "medium" | "low";
  assignedTo: { name: string }[];
  dueDate: string;
}

// Props for TaskCard Component
interface TaskCardProps {
  id: string;
}

const TaskCard = (id:any ) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const tasksPerPage = 4;

  // Fetch tasks from API
  const { data, isLoading, error } = useTaskByOrganizationQuery(id);
  const tasks: Task[] = data?.data || [];

  const [deleteTask] = useDeleteTaskMutation();

  // Filter Tasks by Priority
  const filteredTasks =
    priorityFilter === "all"
      ? tasks
      : tasks.filter((task) => task.priority === priorityFilter);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTaskId(null);
  };

  const handleDelete = async (taskId: string) => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteTask(taskId).unwrap();
      ShowToast({ message: "Task Deleted Successfully!" });
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) return <p>Loading tasks...</p>;
  if (error) return <p>Error fetching tasks!</p>;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <UpdateTaskModal
        title="Edit Task"
        visible={isModalVisible}
        onCancel={handleCancel}
        taskId={selectedTaskId!}
      />

      {tasks.length > 0 && (
        <div className="flex justify-between mb-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Tasks</h2>
          <select
            className="mb-4 p-2 border rounded-lg"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {paginatedTasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-lg border border-gray-100 p-4 relative hover:shadow-lg"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {task.title}
                </h3>
                <div
                  className={`ml-0 sm:ml-4 mt-2 inline-block ${
                    task.status === "to-do"
                      ? "bg-blue-500 text-white"
                      : task.status === "in-progress"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  } rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1`}
                >
                  {task.status.replace("-", " ")}
                </div>
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
                Due Date:{" "}
                <span className="text-gray-600 font-normal ml-2">
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
                <span className="mr-2 text-gray-600">Priority:</span>
                <span
                  className={`rounded-full text-xs sm:text-sm px-2 py-1 ${
                    task.priority === "high"
                      ? "bg-red-500 text-white"
                      : task.priority === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => showModal(task._id)}
                className="flex items-center justify-center rounded-lg bg-white text-[#2255d3] px-3 py-2 text-sm font-semibold border border-[#2255d3] hover:bg-blue-700 hover:text-white"
              >
                <BiEditAlt className="mr-1" />
              </button>

              <button
                onClick={() => handleDelete(task._id)}
                className="flex items-center justify-center rounded-lg bg-white text-red-600 px-3 py-2 text-sm font-semibold border border-red-600 hover:bg-red-700 hover:text-white"
              >
                <MdDelete className="mr-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskCard;
