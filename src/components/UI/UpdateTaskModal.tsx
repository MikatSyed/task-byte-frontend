import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { CgClose } from 'react-icons/cg';
import FormInput from '../Forms/FormInput';
import FormTextArea from '../Forms/FormTextArea';
import Form from '../Forms/Form';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateTaskSchema } from '../../schemas/taskSchema';
import { useUsersQuery } from '@/redux/api/userApi';
import FormDatePicker from '../Forms/FormDatePicker';
import { useTaskQuery, useUpdateTaskMutation } from '@/redux/api/taskApi';
import { ShowToast } from './ShowToast';
import Select from 'react-select';

interface UpdateTaskModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  taskId: string;
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({ 
  title, 
  visible, 
  onCancel, 
  taskId 
}) => {
  const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);
  const [priority, setPriority] = useState<string | null>(null);
  const [priorityError, setPriorityError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const { data, isLoading, error } = useUsersQuery(undefined);
  const members = data?.data || [];

  // Fetch task details
  const { data: task, isLoading: taskLoading, error: taskError } = useTaskQuery(taskId);

  useEffect(() => {
    if (task) {
      // Set the default form values when task data is fetched
      setSelectedAssignees(task.data.assignedTo.map((assignee: any) => ({
        label: assignee.name,
        value: assignee._id,
      })));
      setPriority(task.data.priority);
      setDueDate(new Date(task.data.dueDate));
    }
  }, [task]);

  const [updateTask] = useUpdateTaskMutation();

  const handleAssigneeChange = (selected: any) => {
    setSelectedAssignees(selected);
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

  const onSubmit = async (values: any) => {
    let hasError = false;

    if (selectedAssignees.length === 0) {
      toast.error('Please select at least one assignee.');
      hasError = true;
    }

    if (!priority) {
      setPriorityError('Please select a priority.');
      hasError = true;
    } else {
      setPriorityError(null);
    }

    if (hasError) return;

    const formattedTask = {
      title: values.title,
      description: values.description,
      status: 'in-progress',
      priority: priority,
      dueDate: values.dueDate.toISOString(),
      assignedTo: selectedAssignees.map((assignee) => assignee.value),
      taskId: taskId,
    };

    const toastId = toast.loading('Updating Task...');
    try {
      console.log('Submitting Task:', formattedTask);
      await updateTask({id:taskId,body:formattedTask});
      ShowToast({ message: 'Task Updated Successfully!' });
      onCancel();
    } catch (err: any) {
   
      toast.error('Failed to update task.');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const defaultValues = {
    title: task?.data?.title || '',
    description: task?.data?.description || '',
    dueDate: task?.data?.dueDate || '',
    assignee: task?.data?.assignee || '',
    priority: task?.data?.priority || '',
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

      <Form submitHandler={onSubmit} resolver={yupResolver(updateTaskSchema)} defaultValues={defaultValues}>
        <FormInput name="title" label="Title" />
        <FormTextArea name="description" label="Description" rows={4} />
        <div className="w-full mb-2">
          <label className="block text-sm font-medium text-gray-600">Assignees</label>
          {isLoading || taskLoading ? (
            <p className="text-sm text-gray-500">Loading members...</p>
          ) : error || taskError ? (
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

        <FormDatePicker name="dueDate" label="Due Date"  />
        <button type="submit" className="w-full mt-4 py-2 px-4 bg-[#2255d3] text-white rounded-md">
          Update Task
        </button>
      </Form>
    </ReactModal>
  );
};

export default UpdateTaskModal;
