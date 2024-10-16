import React, { useEffect, useState } from "react";
import { FaCircleExclamation, FaRegEye, FaRegEyeSlash } from "react-icons/fa6"; 
import { useFormContext } from "../hooks/useFormContext";
import { InputFieldProps } from "../models/Models";

// The InputBox component supports different input types like text, email, password, textarea, etc.
const InputBox: React.FC<InputFieldProps> = ({
  type,
  required,
  placeholder,
  width,
  height,
  color,
  bgColor,
  validateFunc,
  fieldKey,
  defaultErrorText,
  value,
  font,
  onClick,
  className,
  ...args
}) => {
  // Get required functions from form context
  const { hasRegistered, registerField, updateField, fields, handleClick } = useFormContext();

  // State to toggle password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Register the field when the component mounts, avoid re-registering if already registered
  useEffect(() => {
    if (!hasRegistered(fieldKey)) {
      registerField(fieldKey, required, value, defaultErrorText, validateFunc, type, placeholder || "");
    }
  }, [fieldKey, value, defaultErrorText, validateFunc, hasRegistered, registerField]);
  useEffect(
    ()=>{
      setIsPasswordVisible(false);
    }
  ,[]);

  // Find the current field's value and error state
  const currentField = fields.find(field => field.fieldKey === fieldKey);
  const currentValue = currentField?.value || value; 
  const error = currentField?.error;
  
  // Update field value on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(fieldKey, e.target.value);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  // Check if any field has an error to control form submission
  const hasErrorInAnyField = fields.some(field => field.error);

  // Render error message if the field has an error
  const renderError = () => (
    <p className={`absolute left-0 m-2 flex items-center text-red-600 text-[8px] transition-all ${error ? "opacity-100 bottom-0" : "opacity-0 bottom-2"}`}>
      <FaCircleExclamation className="mx-1" />
      {error}
    </p>
  );

  // Render the password visibility toggle icon
  const renderPasswordIcon = () => (
    <div className="absolute right-0 mx-4 cursor-pointer" onClick={togglePasswordVisibility}>
      {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
    </div>
  );
  return (
    <div className="relative flex items-center justify-center w-fit">
      {type === "textarea" ? (
        // Textarea input for multi-line text
        <textarea
          required={required}
          placeholder={placeholder}
          className={`focus:shadow-sm transition-all border rounded-md p-3 outline-none m-1 ${error ? 'border-red-500' : currentValue!="" ? 'border-green-500' : ''} ${className || ""}`}
          style={{ backgroundColor: bgColor || "inherit", color: color || "inherit", fontSize: "inherit", fontFamily: font || "inherit" }}
          onChange={handleInputChange}
          value={currentValue}
          {...args}
        />
      ) : (
        // General input for various types (text, password, etc.)
        <input
          type={type === "password" ? (!isPasswordVisible ? "password" : "text") : type}
          required={required}
          placeholder={placeholder}
          className={`focus:shadow-md ease-in transition-all border rounded-md px-3 py-3 outline-none m-1 ${type === "button" ? "hover:shadow-slate-500 cursor-pointer flex items-center justify-center" : error ? 'border-red-500 ' : currentValue!=="" ? 'border-green-500' : ''} ${hasErrorInAnyField && type === "button" ? " pointer-events-none opacity-40 " : ""} ${className || ""}`}
          style={{ backgroundColor: bgColor || "inherit", color: color || "inherit", width: width || "20dvw", height: height || "fit-content", fontSize: "inherit", fontFamily: font || "inherit" }}
          onChange={handleInputChange}
          value={currentValue}
          {...args}
          onClick={(e) => { e.preventDefault(); onClick && handleClick(onClick); }}
          disabled={type === "button" && hasErrorInAnyField}
        />
      )}

      {type === "password" && renderPasswordIcon()}
      {type !== "checkbox" && renderError()}
    </div>
  );
};

export default InputBox;
