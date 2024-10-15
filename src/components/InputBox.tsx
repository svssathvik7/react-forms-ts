import React, { useEffect, useState } from "react";
import { FaCircleExclamation, FaRegEye, FaRegEyeSlash } from "react-icons/fa6"; 
import { useFormContext } from "../hooks/useFormContext";
import { InputFieldProps } from "../models/Models";
// The InputBox component is a versatile input field that supports various types: text, email, password, textarea, date,file,tel,button
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
  // required functions from formcontext
  const { hasRegistered, registerField, updateField, fields, handleClick } = useFormContext();
  // to maintain password show and hide functionality
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const hasAlreadyRegistered = hasRegistered(fieldKey);
    // to avoid duplicate registrations
    if (!hasAlreadyRegistered) {
      registerField(fieldKey, required, value, defaultErrorText, validateFunc, type, placeholder ? placeholder : "");
    }
    setIsPasswordVisible(false);
  }, [fieldKey, value, defaultErrorText, validateFunc, hasRegistered, registerField]);
  // obtain current field to manipulate
  const currentField = fields.find((field) => field.fieldKey === fieldKey);
  const currentValue = currentField ? currentField.value : value; 
  const error = currentField ? currentField.error : undefined;
  // state and error updation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value; 
    updateField(fieldKey, newValue);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  // future scope to disable form submission
  const hasErrorInAnyField = fields.some((field) => field.error);

  return (
    <div className="relative flex items-center justify-center w-fit">
      {type === "textarea" ? ( 
        <textarea
          required={required}
          placeholder={placeholder}
          className={`focus:shadow-sm focus:shadow-gray-500 transition-all ease-in border rounded-md p-3 outline-none m-1 valid:border-[1px] ${error ? ' border-red-500 ' : (currentValue !== "" ? ' border-[1px] border-green-500 ' : ' ')} ${className || ""}`} 
          style={{
            backgroundColor: bgColor || "inherit",
            color: color || "inherit",
            fontSize: "inherit",
            fontFamily: font || "inherit"
          }}
          onChange={handleInputChange}
          value={currentValue}
          {...args}
        />
      ) : (
        <input
          type={type === "password" && !isPasswordVisible ? "password" : type}
          required={required}
          placeholder={placeholder}
          className={`focus:shadow-sm focus:shadow-gray-500 transition-all ease-in border rounded-md px-3 py-3 outline-none m-1 valid:border-[1px] ${type === "button" ? " flex items-center justify-center hover:shadow-sm hover:shadow-slate-500 cursor-pointer " : error ? ' border-red-500 ' : (currentValue !== "" ? ' border-[1px] border-green-500 ' : ' ')} 
          ${hasErrorInAnyField && type === "button" ? " pointer-events-none opacity-40 " : "  "} 
          ${className || ""}`} 
          style={{
            backgroundColor: bgColor || "inherit",
            color: color || "inherit",
            width: width || (type === "checkbox" ? "2dvw" : "20dvw"),
            height: height || (type === "checkbox" ? "2dvh" : "fit-content"),
            fontSize: "inherit",
            fontFamily: font || "inherit"
          }}
          onChange={handleInputChange}
          value={currentValue}
          {...args}
          onClick={(e) => {e.preventDefault(); onClick && handleClick(onClick);}}
          disabled={type === "button" && hasErrorInAnyField}
        />
      )}

      {type === "password" && (
        <div className="absolute right-0 mx-4 cursor-pointer" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
        </div>
      )}
      {error && type !== "checkbox" && (
        <p className="text-red-600 text-[8px] text-left absolute bottom-0 left-0 m-2 flex items-center justify-center">
          <FaCircleExclamation className="mx-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default InputBox;
