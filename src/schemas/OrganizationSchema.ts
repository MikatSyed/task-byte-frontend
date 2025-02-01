import * as Yup from 'yup';

export const addOrganizationSchema = Yup.object().shape({
  name: Yup.string().required('Organization Name is required'),
});
