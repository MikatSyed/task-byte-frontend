import React, { ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { getErrorMessageByPropertyName } from "../../utils/schema-validator";


interface FormDatePickerProps {
  name: string;
  label?: string ;
  onChange?: (selectedDate: Dayjs, formattedDate: string) => void;
  size?: "large" | "small";
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({ 
  name, 
  label, 
  onChange, 
  size = "large" 
}) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = dayjs(e.target.value);
    if (onChange) {
      onChange(selectedDate, selectedDate.format("YYYY-MM-DD"));
    }
    setValue(name, selectedDate.format("YYYY-MM-DD"));
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="date"
            value={field.value ? dayjs(field.value).format("YYYY-MM-DD") : ""}
            onChange={(e) => {
              handleOnChange(e);
              field.onChange(e); // Synchronize with react-hook-form
            }}
            className={`mt-1 p-2 w-full border rounded-md ${size === "large" ? "text-lg" : "text-sm"}`}
          />
        )}
      />
      {errorMessage && (
        <small className="text-red-500 mt-1">{errorMessage}</small>
      )}
    </div>
  );
};

export default FormDatePicker;
