import './ResetPassword.scss';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spninner/Spinner';
import Card from '../../components/UI/Card/Card';
import { FormEvent, useEffect, useState, useMemo } from 'react';
import useInput from '../../hooks/useInput';
import { useParams, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { notificationActions } from '../../store/reducers/notifications';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import useWhyDidYouUpdate from '../../hooks/useWhyDidYouUpdate';

interface ILoginFormProps {
    children?: never,
}

function ResetPassword(props: ILoginFormProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {link} = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false); 


    const passwordValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 5, maxLength: 20};
        },
        []
    );
    const password = useInput('reset-password', '', passwordValidators);


    const confirmValidators = useMemo(
        function() {
            return {isEmpty: true, minLength: 5, maxLength: 20, isMatch: {value: password.value, message: 'Пароли не совпадают'}};
        },
        [password.value]
    );
    const confirmPas = useInput('reset-confirm-pass', '', confirmValidators);


    useWhyDidYouUpdate('ResetPassword', {link, isLoading, isValid, password, confirmPas});


    useEffect(() => {
        const errMessages = [...password.messages, ...confirmPas.messages];
        setIsValid(errMessages.length > 0 ? false : true);
    }, [password.messages, confirmPas.messages]);
    

    async function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        try {
            await AuthService.resetPassword(link!, password.value);
            dispatch(notificationActions.add({type: 'success', message: 'Password has been successfully changed'}));
            navigate('/', {replace: true});
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='reset-password'>
            <Card>
                <h4>Reset password</h4>
                <form className='reset-password__form' onSubmit={submitHandler}>
                    <div className="mb-3">
                        <Input 
                            name='reset-password'
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
                            name='reset-confirm-password'
                            type='password' 
                            label='Confirm password' 
                            onChange={confirmPas.onChange} 
                            onBlur={confirmPas.onBlur}
                            value={confirmPas.value} 
                            messages={confirmPas.isDirty && confirmPas.messages.length > 0 ? confirmPas.messages : []}
                        />
                    </div>
                    {
                        isLoading ? 
                        <div className="d-flex justify-content-center align-items-center"> <Spinner/> </div>: 
                        <Button type='submit' className='btn-success d-block ms-auto' isDisabled={!isValid}>Reset</Button>
                    }
                </form>
            </Card>
        </div>
    )
}

export default ResetPassword;