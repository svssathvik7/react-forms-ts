export type CommonFieldProps = {
    fieldKey: string;
    value: string | number;
    error?: string;
    width?: string;
    height?: string;
    color?: string;
    bgColor?: string;
    font?: string;
    required: boolean;
    className?: string;
    [key: string]: any;
};

export type InputFieldProps = CommonFieldProps & {
    defaultErrorText: string;
    validateFunc: (data: any) => boolean;
    type: string; // e.g., "text", "email", etc.
    placeholder: string;
    onClick?: (event: React.FormEvent<HTMLInputElement>) => void;
};

export type DropDownFieldProps = CommonFieldProps & {
    options: string[];
    type?: string; // Optional; can specify if it's a dropdown or something else
};

export type FormSpecificTypes = {
    getFormState: () => string; // Improved type safety
    hasRegistered: (fieldKey: string) => boolean;
    registerField: (
        fieldKey: string,
        required: boolean,
        value: string | number,
        defaultErrorText?: string,
        validateFunc?: (data: any) => boolean,
        type?: string,
        placeholder?: string,
        options?: string[]
    ) => boolean;
    updateField: (fieldKey: string, newValue: string | number) => boolean;
    fields: (InputFieldProps | DropDownFieldProps)[];
    resetForm: () => void;
    handleClick: Function; 
    debouncerDelay?: number;
    className?: string;
    submitFunc:Function;
    handleSubmit:Function;
};
