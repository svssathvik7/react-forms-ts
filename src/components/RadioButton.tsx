import React, { useEffect } from "react";
import { useFormContext } from "../hooks/useFormContext";
import { CommonFieldProps } from "../models/Models";
// The RadioButton component allows users to select one option from a list of choices.

// options act as the dropdown list
interface RadioButtonProps extends CommonFieldProps {
    options: string[]; 
}

const RadioButton: React.FC<RadioButtonProps> = ({
    required,
    width,
    height,
    color,
    bgColor,
    fieldKey,
    value,
    font,
    options,
    type,
    defaultErrorText,
    validateFunc,
    className = "",
}) => {
    // required functions from formcontext

    const context = useFormContext();
    const { hasRegistered, registerField, updateField, fields } = context;

    useEffect(() => {
        // avoid dup registration
        const hasAlreadyRegistered = hasRegistered(fieldKey);
        if (!hasAlreadyRegistered) {
            registerField(
                fieldKey,
                required,
                value || "",
                defaultErrorText || "",
                () => true,
                type,
                "",
                options
            );
        }
    }, [fieldKey, required, value, defaultErrorText, validateFunc, hasRegistered, registerField]);

    const currentField = fields.find((field) => field.fieldKey === fieldKey);

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value;
        console.log(selectedValue);
        updateField(fieldKey, selectedValue);
    };

    return (
        <div 
            className={`${className ? className : " flex flex-col items-start justify-start text-left p-3 "}`} 
            style={{ width, height, color, backgroundColor: bgColor, fontFamily: font }}
        >
            {options.map((option, index) => (
                <label key={index} style={{ display: 'inline-block' }}>
                    <input
                        type="radio"
                        name={fieldKey} 
                        value={option} 
                        checked={currentField?.value === option}
                        onChange={handleRadioChange}
                        required={required}
                        style={{ marginRight: '0.5rem' }}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};

export default RadioButton;
