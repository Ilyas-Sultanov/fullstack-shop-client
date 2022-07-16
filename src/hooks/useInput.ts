import { ChangeEvent, useState, FocusEvent } from "react";
import useValidation from "./useValidation";
import { validationType } from "../helpers/validation";


const useInput = (name: string, initialValue: string, validations: validationType) => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setIsDirty] = useState(false);

    const errMessages = useValidation(value, validations);
    
    function onChange(event: ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value.trim());
    }

    function onBlur(event: FocusEvent<HTMLInputElement>) {
        setIsDirty(true);
    }

    function clear() {
        setValue("");
    }

    function setNewValue(value: string | number) {
        setValue(String(value));
    }

    return {
        name,
        value,
        onChange,
        onBlur,
        clear,
        setNewValue,
        isDirty,
        messages: errMessages,
    }
}

export default useInput;