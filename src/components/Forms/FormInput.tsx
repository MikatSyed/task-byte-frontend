"use client";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { getErrorMessageByPropertyName } from "../../utils/schema-validator";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icons

interface IInput {
  name: string;
  type?: string;
  size?: "large" | "small";
  value?: string | string[];
  id?: string;
  placeholder?: string;
  validation?: object;
  label?: string;
  className?: string;
}

const FormInput = ({
  name,
  type = "text",
  size = "large",
  value,
  id,
  placeholder,
  label,
  className = "",
}: IInput) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {label && <div className="block text-sm font-medium text-gray-700 ">{label}</div>}
      <div className="relative w-full">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <input
              type={type === "password" && !showPassword ? "password" : "text"}
              id={id}
              placeholder={placeholder}
              className={`w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className} ${
                size === "large" ? "text-lg" : "text-sm"
              }`}
              {...field}
              value={value ?? field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        )}
      </div>
      {errorMessage && <small className="text-red-500 mt-1 block">{errorMessage}</small>}
    </>
  );
};

export default FormInput;
