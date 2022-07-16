import './LoginForm.scss';
import { FormEvent, Fragment, useEffect, useState, useMemo } from 'react';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import useInput from '../../hooks/useInput';


interface ILoginFormProps {
    children?: never,
    onLogin: (email: string, password: string) => void,
    onCancel: () => void,
}

function LoginForm({onLogin, onCancel}: ILoginFormProps) {
    const [isValid, setIsValid] = useState(false);

    const emailValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 3, maxLength: 50, isEmail: true};
        },
        []
    );

    const passwordValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 5, maxLength: 20};
        },
        []
    );
    
    const email = useInput('login-email', '', emailValidators);
    const password = useInput('login-password', '', passwordValidators);


    useEffect(() => {
        const errMessages = [...email.messages, ...password.messages];
        setIsValid(errMessages.length > 0 ? false : true);
    }, [email.messages, password.messages]);   

    
    const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onLogin(email.value, password.value);
    }

    return (
        <Fragment>
            <form className='login-form' onSubmit={submitHandler}>
                <div className="mb-3">
                    <Input 
                        type='email' 
                        name='login-email'
                        label='Email' 
                        onChange={email.onChange}
                        onBlur={email.onBlur}
                        value={email.value}
                        messages={email.isDirty && email.messages ? email.messages : []} // сообщение выводится если инпут уже имел фокус, но все еще пуст
                    />
                </div>
                <div className="mb-3">
                    <Input 
                        type='password' 
                        name='login-password'
                        label='Password' 
                        onChange={password.onChange}
                        onBlur={password.onBlur}
                        value={password.value}
                        messages={password.isDirty && password.messages ? password.messages : []}
                    />
                </div>

                <div className="d-flex justify-content-evenly">
                    <Button type='submit' className='btn-success' isDisabled={!isValid}>Login</Button>
                    <Button className='btn-danger' onClick={onCancel}>Cancel</Button>
                </div>
            </form>
        </Fragment>
    )
}

export default LoginForm;