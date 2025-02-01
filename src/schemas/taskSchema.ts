import * as Yup from 'yup';

export const addTaskSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due Date is required'),
});

export const updateTaskSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').optional(),
  description: Yup.string().required('Description is required').optional(),
  dueDate: Yup.date().required('Due Date is required').optional(),
});