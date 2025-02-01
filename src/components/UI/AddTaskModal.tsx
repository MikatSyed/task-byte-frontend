import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { CgClose } from 'react-icons/cg';
import FormInput from '../Forms/FormInput';
import FormTextArea from '../Forms/FormTextArea';
import Form from '../Forms/Form';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { addTaskSchema } from '../../schemas/taskSchema';
import { useUsersQuery } from '@/redux/api/userApi';
import FormDatePicker from '../Forms/FormDatePicker';
import { useAddTaskMutation } from '@/redux/api/taskApi';
import { ShowToast } from './ShowToast';
import Select from 'react-select';


interface AddTaskModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  organizationId: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ 
  title, 
  visible, 
  onCancel, 
  organizationId 
}) => {
  const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);
  const [priority, setPriority] = useState<string | null>(null);
  const [priorityError, setPriorityError] = useState<string | null>(null);

  // Fetch users (members) from API
  const { data, isLoading, error } = useUsersQuery(undefined);
  const members = data?.data || [];

  const [addTask] = useAddTaskMutation();

  const handleAssigneeChange = (selected: any) => {
    setSelectedAssignees(selected);
  };

  const onSubmit = async (values: any) => {
    let hasError = false;

    // Validate Assignees
    if (selectedAssignees.length === 0) {
      toast.error('Please select at least one assignee.');
      hasError = true;
    }

    // Validate Priority
    if (!priority) {
      setPriorityError('Please select a priority.');
      hasError = true;
    } else {
      setPriorityError(null);
    }

    if (hasError) return;

    // Prepare task data
    const formattedTask = {
      title: values.title,
      description: values.description,
      status: 'in-progress',
      priority: priority,
      dueDate: values.dueDate.toISOString(),
      assignedTo: selectedAssignees.map((assignee) => assignee.value),
      organization: organizationId,
    };

    const toastId = toast.loading('Adding Task...');
    try {
      console.log('Submitting Task:', formattedTask);
      await addTask(formattedTask);
      ShowToast({ message: 'Task Added Successfully!' });
      onCancel();
    } catch (err: any) {
      console.error('Error adding task:', err.message);
      toast.error('Failed to add task.');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const customOption = (props: any) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          checked={data.isSelected} 
          readOnly 
          className="w-4 h-4 text-[#2255d3] border-gray-300 rounded" 
        />
        <span>{data.label}</span>
      </div>
    );
  };

  return (
    <ReactModal
      isOpen={visible}
      onRequestClose={onCancel}
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg mx-auto outline-none"
      ariaHideApp={false}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-[#2255d3] font-semibold text-xl">{title}</div>
        <button onClick={onCancel}>
          <CgClose className="text-[#2255d3]" size={20} />
        </button>
      </div>

      <Form submitHandler={onSubmit} resolver={yupResolver(addTaskSchema)}>
        <div className="w-full mb-2">
          <FormInput name="title" label="Title" className="w-full" />
        </div>

        <div className="w-full mb-2">
          <FormTextArea name="description" label="Description" rows={4} className="w-full" />
        </div>

        {/* Assignee Multi-Select Dropdown */}
        <div className="w-full mb-2">
          <label className="block text-sm font-medium text-gray-600">Assignees</label>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading members...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Error loading members</p>
          ) : (
            <Select
              isMulti
              value={selectedAssignees}
              onChange={handleAssigneeChange}
              options={members.map((member: any) => ({
                label: member.name,
                value: member.id,
              }))}
              components={{ Option: customOption }}
              className="mt-2"
            />
          )}
        </div>

        {/* Priority Dropdown */}
        <div className="w-full mb-2">
          <label className="block text-sm font-medium text-gray-600">Priority</label>
          <select
            className="mt-2 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none"
            value={priority || ''}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {priorityError && <p className="text-red-500 text-sm mt-1">{priorityError}</p>}
        </div>

        <div className="w-full mb-2">
          <FormDatePicker name="dueDate" label="Due Date" />
        </div>

        <button
          type="submit"
          className="mt-4 py-2 px-4 rounded-md font-semibold text-white bg-[#2255d3] hover:bg-blue-700 transition-colors duration-300 w-full"
        >
          Add Task
        </button>
      </Form>
    </ReactModal>
  );
};

export default AddTaskModal;
