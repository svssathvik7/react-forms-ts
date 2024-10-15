import { createContext, ReactNode, useState } from "react";
import { InputFieldProps, FormSpecificTypes, DropDownFieldProps } from "../models/Models";
import {useDebounce} from "../hooks/Debouncer";

type FormStateType = FormSpecificTypes;

const FormContext = createContext<FormStateType | null>(null);
const invertInput = (input:string|number):string=>{
    if(input == "true"){
        return "false";
    }
    else{
        return "true";
    }
}
export const FormProvider = ({ children,debounceDelay=300 }: { children: ReactNode,debounceDelay?:number}) => {
    const [fields, setFields] = useState<(InputFieldProps|DropDownFieldProps)[]>([]);

    const resetForm = () => {
        setFields([]);
    };

    const hasRegistered = (fieldKey: string): boolean => {
        return fields.some(field => field.fieldKey === fieldKey);
    };
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
    const updateField = (fieldKey: string, newValue: string | number): boolean => {
        const fieldIndex = fields.findIndex(field => field.fieldKey === fieldKey);
        if (fieldIndex === -1) {
            console.warn(`Field with fieldKey "${fieldKey}" does not exist.`);
            return false;
        }

        const fieldToUpdate = fields[fieldIndex];
        console.log(fieldKey,newValue);
        setFields(prevFields => {
            const updatedFields = [...prevFields];

            updatedFields[fieldIndex] = {
                ...updatedFields[fieldIndex],
                value: fieldToUpdate.type==="checkbox" ? invertInput(fieldToUpdate.value) : newValue,
            };

            return updatedFields;
        });
        validateData(fieldIndex);
        return true;
    };

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
        console.log(fieldKey, 
            required,
            value, 
            defaultErrorText, 
            validateFunc,
            type,
            placeholder,
            options)
        if(type!==undefined && defaultErrorText && placeholder && validateFunc){
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

    const getFormState = (): Record<string, string | number> => {
        const formState: Record<string, string | number> = {};
    
        fields.forEach(field => {
            formState[field.fieldKey] = field.value;
            console.log(formState);
        });
    
        return formState;
    };    

    const handleClick:Function = (cb:Function)=>{
        const data = getFormState();
        const response = cb ? cb(data) : data;
        console.log(response);
        resetForm();
        return response;
    }
    return (
        <FormContext.Provider value={{ fields, resetForm, registerField, updateField, hasRegistered, getFormState, handleClick}}>
            {children}
        </FormContext.Provider>
    );
};

export { FormContext };
