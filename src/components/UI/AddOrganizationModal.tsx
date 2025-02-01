import React from "react";
import ReactModal from "react-modal";
import { CgClose } from "react-icons/cg";
import FormInput from "../Forms/FormInput";
import Form from "../Forms/Form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { addOrganizationSchema } from "../../schemas/OrganizationSchema";
import { useAddOrganizationMutation } from "@/redux/api/organizationApi";

interface AddOrganizationModalProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
  onOrganizationAdded: () => void;
}

const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({
  title,
  visible,
  onCancel,
  onOrganizationAdded,
}) => {
  const [addOrganization] = useAddOrganizationMutation();

  const onSubmit = async (values: any) => {
    const toastId = toast.loading("Posting...");
    try {
      await addOrganization(values);
      toast.success("Organization added successfully!");
      onOrganizationAdded();
    } catch (err: any) {
      toast.error("Failed to add organization.");
      console.error("Error adding Organization:", err.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <ReactModal
      isOpen={visible}
      onRequestClose={onCancel}
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center p-5"
      className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg mx-auto outline-none mt-10"
      ariaHideApp={false}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-[#2563eb] font-semibold text-xl">
          {title}
        </div>
        <button onClick={onCancel}>
          <CgClose className="text-[#2563eb]" size={20} />
        </button>
      </div>

      <Form submitHandler={onSubmit} resolver={yupResolver(addOrganizationSchema)}>
        <div className="w-full mb-2">
          <FormInput name="name" label="Organization Name" className="w-full" />
        </div>

        <button
          type="submit"
          className="mt-4 py-2 px-4 rounded-md font-semibold text-white bg-[#2563eb] hover:bg-blue-700 transition-colors duration-300 w-full"
        >
          Add Organization
        </button>
      </Form>
    </ReactModal>
  );
};

export default AddOrganizationModal;
