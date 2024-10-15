import { useContext } from "react";
import { FormContext } from "../context/FormContext";
// a custom hook for components to use context members
export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
};
