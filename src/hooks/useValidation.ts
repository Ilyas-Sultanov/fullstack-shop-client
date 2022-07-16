import { useEffect, useState } from "react";
import validation, {validationType} from '../helpers/validation';

const useValidation = (value: string, validations: validationType) => {
    const [errMessages, setErrMessages] = useState(['']);

    useEffect(() => {
        const messages = validation(value, validations);
        if (messages.length > 0) {
            setErrMessages(messages);
        }
        else {
            setErrMessages([]);
        }
    }, [value, validations]);

    return errMessages;
}

export default useValidation;








// import { useEffect, useState } from "react";

// export type validationType = {
//     isEmpty?: boolean,
//     minLength?: number,
//     maxLength?: number,
//     isEmail?: true,
//     isMatch?: {value: string, message: string},
//     isDate?: boolean,
// }

// const useValidation = (value: string, validations: validationType) => {
//     const [errMessages, setErrMessages] = useState(['']);

//     useEffect(() => {
//         const messages: string[] = [];

//         for (let v in validations) {
//             switch (v) {
//                 case 'isEmpty':
//                     if (!value) messages.push('Поле не может быть пустым');
//                     break;
//                 case 'minLength':
//                     if (value.length < validations[v]!) messages.push(`Минимальная длина ${validations[v]}`);
//                     break;
//                 case 'maxLength':
//                     if (value.length > validations[v]!) messages.push(`Максимальная длина ${validations[v]}`);
//                     break;
//                 case 'isEmail':
//                     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//                     if (!re.test(String(value).toLowerCase())) messages.push('Не корректный email');
//                     break;
//                 case 'isMatch':
//                     if (value !== validations[v]!.value) messages.push(`${validations[v]!.message}`);
//                     break;
//                 case 'isDate':
//                     if(isNaN(Date.parse(value))) messages.push('Не валидная строка');
//                     break;
//             }
//         }

//         if (messages.length > 0) {
//             setErrMessages(messages);
//         }
//         else {
//             setErrMessages([]);
//         }
//     }, [value, validations]);

//     return errMessages;
// }

// export default useValidation;