import { createContext, ReactNode, useState } from "react";
import { InputFieldProps, FormSpecificTypes, DropDownFieldProps } from "../models/Models";
import {useDebounce} from "../hooks/Debouncer";

// type defined in models
type FormStateType = FormSpecificTypes;


// creation of form context
const FormContext = createContext<FormStateType | null>(null);

// to make input component versatile a small utility that makes InputBox work like checkbox too
const invertInput = (input:string|number):string=>{
    if(input == "true"){
        return "false";
    }
    else{
        return "true";
    }
}
export const FormProvider = ({ children,debounceDelay=300,submitFunc,className }: { children: ReactNode,debounceDelay?:number,submitFunc:Function, className?:string}) => {
    // debounce delay is an optional
    const [fields, setFields] = useState<(InputFieldProps|DropDownFieldProps)[]>([]);

    // resets all the form fields to empty
    const resetForm = () => {
        setFields([]);
    };


    // utilty to check the membership of an input field
    const hasRegistered = (fieldKey: string): boolean => {
        return fields.some(field => field.fieldKey === fieldKey);
    };

    // a function that ( actually is a closure for debouncing ) is called on update with debouncing for error checking/ input validation
    const validateData = useDebounce(
        (fieldIndex:number)=>{
            const fieldToUpdate = fields[fieldIndex];
            const isValid = fieldToUpdate.validateFunc(fieldToUpdate.value);
            setFields(
                prevFields => {
                    const updatedFields = [...prevFields];
                    updatedFields[fieldIndex] = {
                        ...updatedFields[fieldIndex],
                        error: isValid ? "" : fieldToUpdate.defaultErrorText
                    };
                    return updatedFields;
                }
            )
        }
    ,debounceDelay);

    // the state updation function, the key idea is update the ui but debounce the validation
    const updateField = (fieldKey: string, newValue: string | number): boolean => {
        const fieldIndex = fields.findIndex(field => field.fieldKey === fieldKey);
        // check if there exists a field with the given update fieldKey
        if (fieldIndex === -1) {
            console.warn(`Field with fieldKey "${fieldKey}" does not exist.`);
            return false;
        }

        const fieldToUpdate = fields[fieldIndex];
        // updating the UI
        setFields(prevFields => {
            const updatedFields = [...prevFields];

            updatedFields[fieldIndex] = {
                ...updatedFields[fieldIndex],
                value: fieldToUpdate.type==="checkbox" ? invertInput(fieldToUpdate.value) : newValue,
            };

            return updatedFields;
        });
        // checkboxes and dropdowns usually have no significance of debouncing and validation
        if(fieldToUpdate.type!=="checkbox" && fieldToUpdate.type!=="" && fieldToUpdate.type!==undefined){
            // debounce validator
            validateData(fieldIndex);
        }
        return true;
    };

    // to maintain dynamic context form states, we register each field in the form
    const registerField = (
        fieldKey: string, 
        required: boolean,
        value: string | number, 
        defaultErrorText?: string, 
        validateFunc?: (data: any) => boolean,
        type?: string | undefined,
        placeholder?: string,
        options?:string[],
    ): boolean => {
        if(type!==undefined && defaultErrorText!==undefined && placeholder!=undefined && validateFunc){
            const fieldExists = hasRegistered(fieldKey);
            if (fieldExists) {
                console.warn(`Field with fieldKey "${fieldKey}" already exists.`);
                return false;
            }
            
            setFields(prevFields => [
                ...prevFields,
                { 
                    fieldKey:fieldKey, 
                    required:required,
                    value: type==="checkbox" ? value="false" : value, 
                    defaultErrorText:defaultErrorText, 
                    validateFunc:validateFunc, 
                    type:type,
                    placeholder: placeholder ? placeholder : "",
                }
            ]);
        }
        else if(fieldKey && required && options){
            setFields(prevFields => [
                ...prevFields,
                { 
                    fieldKey:fieldKey, 
                    required:required,
                    value: "",
                    options: options
                }
            ]);
        }
        return true;
    };

    // to let the user have granular control over the states, we provide a getFormState function to return current form state
    const getFormState = (): string => {
        const formState: Record<string, string | number> = {};
    
        fields.forEach(field => {
            formState[field.fieldKey] = field.value;
        });
    
        return JSON.stringify(formState);
    };    

    const handleClick:Function = async(cb:Function)=>{
        // execute the callback and return result on success or log the error
        try {
            const res = await cb();
            return res;
        } catch (error) {
            console.log("Failed for onclick : ",error);
        }
    }
    const handleSubmit = async(e: React.FormEvent) => {
        // prevent implicit form clearing
        e.preventDefault();
        const data = getFormState();
        try {
            const response = await submitFunc(data);
            resetForm();
            return response;
        } catch (error) {
            return console.log("Form failed at submission : ",error);
        }
    };
    return (
        <FormContext.Provider value={{ fields, resetForm, registerField, updateField, hasRegistered, getFormState, handleClick, submitFunc, handleSubmit}}>
            <form onSubmit={handleSubmit} className={className || " w-fit "}>
                {children}
            </form>
        </FormContext.Provider>
    );
};

export { FormContext };
