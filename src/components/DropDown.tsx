import React, { useEffect } from "react";
import {useFormContext} from "../hooks/useFormContext";
import { DropDownFieldProps } from "../models/Models";
// The DropDown component allows users to select an option from a dropdown list.

const DropDown: React.FC<DropDownFieldProps> = ({
  required,
  width,
  height,
  color,
  bgColor,
  fieldKey,
  value,
  font,
  options,
  type
}) => {
  // required functions from formcontext
  const context = useFormContext();
  const { hasRegistered, registerField, updateField, fields } = context;

  useEffect(() => {
    const hasAlreadyRegistered = hasRegistered(fieldKey);
    // avoids duplicate registrations in context state
    if (!hasAlreadyRegistered) {
      console.log(registerField(
        fieldKey,
        required,
        value = "",
        "",
        ()=>{return true;},
        type=undefined,
        "",
        options
      ));
    }
  }, [fieldKey, value, hasRegistered, registerField, options]);

  const currentField = fields.find((field) => field.fieldKey === fieldKey);
  // update the state on change
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    updateField(fieldKey, selectedValue);
  };

  return (
    <div className="relative flex items-center justify-center w-fit">
      <select
        value={currentField?.value || ""} 
        onChange={handleSelectChange}
        required={required}
        style={{
          width: width || "20dvw",
          height: height || "fit-content",
          color: color || "inherit",
          backgroundColor: bgColor || "transparent",
          fontFamily: font || "inherit"
        }}
        className="outline-none focus:outline-none px-3 py-2"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDown;
