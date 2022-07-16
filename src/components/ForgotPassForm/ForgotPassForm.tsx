import './ForgotPassForm.scss';
import {useEffect, useState, FormEvent, useMemo} from 'react';
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import useInput from '../../hooks/useInput';

interface IForgotPassFormProps {
    children?: never,
    onForgotPassword: (email: string) => void,
    onCancel: () => void,
}

function ForgotPassForm({onForgotPassword, onCancel}: IForgotPassFormProps) {
    const [isValid, setIsValid] = useState(false);

    
    const emailValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 3, maxLength: 50, isEmail: true};
        },
        []
    );
    const email = useInput('reg-email', '', emailValidators);

    
    useEffect(() => {
        const errMessages = [...email.messages];
        setIsValid(errMessages.length > 0 ? false : true);
    }, [email]);


    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onForgotPassword(email.value); 
    }


    return (
        <form className='reset-form' onSubmit={submitHandler}>
            <div className="mb-3">
                <Input 
                    name='reset-email'
                    type='email' 
                    label='Email' 
                    onChange={email.onChange} 
                    onBlur={email.onBlur}
                    value={email.value}
                    messages={email.isDirty && email.messages.length > 0 ? email.messages : []}
                />
            </div>
            <div className="d-flex justify-content-evenly">
                <Button type='submit' className='btn-success' isDisabled={!isValid}>Send</Button>
                <Button className='btn-danger' onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    )
}

export default ForgotPassForm;