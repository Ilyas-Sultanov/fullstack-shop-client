import './RegForm.scss';
import { FormEvent, useEffect, useState, useMemo } from 'react';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import useInput from '../../hooks/useInput';

interface IRegFormProps {
    children?: never,
    onReg: (name: string, email: string, password: string) => void,
    onCancel: () => void,
}

function RegistrationForm({onReg, onCancel}: IRegFormProps) {
    const [isValid, setIsValid] = useState(false);

    const nameValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 2, maxLength: 15};
        },
        []
    );
    const name = useInput('reg-name', '', nameValidators);


    const emailValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 3, maxLength: 50, isEmail: true};
        },
        []
    );
    const email = useInput('reg-email', '', emailValidators);


    const passwordValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 5, maxLength: 20};
        },
        []
    );
    const password = useInput('reg-password', '', passwordValidators);


    const confirmPasValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 5, maxLength: 20, isMatch: {value: password.value, message: 'Пароли не совпадают'}};
        },
        [password.value]
    );
    const confirmPas = useInput('reg-confirm-pass', '', confirmPasValidators);


    useEffect(() => {
        const errMessages = [...name.messages, ...email.messages, ...password.messages, ...confirmPas.messages];
        setIsValid(errMessages.length > 0 ? false : true);
    }, [name.messages, email.messages, password.messages, confirmPas.messages]);

    const submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onReg(name.value, email.value, password.value); 
    }

    return (
        <form className='reg-form' onSubmit={submitHandler}>
            <div className="mb-3">
                <Input 
                    name='reg-name'
                    label='Name' 
                    onChange={name.onChange} 
                    onBlur={name.onBlur}
                    value={name.value} 
                    messages={name.isDirty && name.messages.length > 0 ? name.messages : []}
                />
            </div>
            <div className="mb-3">
                <Input 
                    name='reg-email'
                    type='email' 
                    label='Email' 
                    onChange={email.onChange} 
                    onBlur={email.onBlur}
                    value={email.value}
                    messages={email.isDirty && email.messages.length > 0 ? email.messages : []}
                />
            </div>
            <div className="mb-3">
                <Input 
                    name='reg-password'
                    type='password' 
                    label='Password' 
                    onChange={password.onChange} 
                    onBlur={password.onBlur}
                    value={password.value} 
                    messages={password.isDirty && password.messages.length > 0 ? password.messages : []}
                />
            </div>
            <div className="mb-3">
                <Input 
                    name='reg-confirm-password'
                    type='password' 
                    label='Confirm password' 
                    onChange={confirmPas.onChange} 
                    onBlur={confirmPas.onBlur}
                    value={confirmPas.value} 
                    messages={confirmPas.isDirty && confirmPas.messages.length > 0 ? confirmPas.messages : []}
                />
            </div>
            <div className="d-flex justify-content-evenly">
                <Button type='submit' className='btn-success' isDisabled={!isValid}>Register</Button>
                <Button className='btn-danger' onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    )
}

export default RegistrationForm;