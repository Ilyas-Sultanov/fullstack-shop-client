import { useEffect, useCallback } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import RegistrationForm from '../RegForm/RegForm';
import LoginForm from '../LoginForm/LoginForm';
import ForgotPassForm from '../ForgotPassForm/ForgotPassForm';
import Card from '../UI/Card/Card';
import Modal from '../UI/Modal/Modal';
import Tabs from '../UI/Tabs/Tabs';
import { RootState } from '../../store/store';
import { authActions } from '../../store/reducers/auth/auth';
import { notificationActions } from '../../store/reducers/notifications';
import { fetchAuth, forgotPassword } from '../../store/reducers/auth/authActionCreators'; //  если передать в функцию fetchAuth параметр name, то это регистрация, иначе логин
import Spinner from '../UI/Spninner/Spinner';

function AuthModal() {
    const dispatch = useDispatch();
    const {isLoading, error, activeTabIndex} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (error) {
            
            /*
                express-validator может вернуть массив строк, на клиент он приходит застрингифаеным.
                Обычные сообщения об ошибке (от сервера) имеют тип - строка 
            */
            // const errors = JSON.parse(error) as Array<string>;
            // for (let i=0; i<errors.length; i+=1) {
            //     dispatch(notificationActions.add({type: 'error', message: errors[i]}));
            // }     
            // dispatch(authActions.setAuthError(''));    
            dispatch(notificationActions.add({type: 'error', message: error}));
        }
    }, [error, dispatch]);

    const onToggleTab = useCallback(
        function(tabIndex: number) {
            dispatch(authActions.setActiveTabIndex(tabIndex));
        },
        [dispatch]
    );
  
    
    const hideAuthModal = useCallback(
        function() {
            dispatch(authActions.setIsShowAuthModal(false));
        },
        [dispatch]
    );
 

    const onLogin = useCallback(
        function(email: string, password: string) {
            dispatch(fetchAuth(email, password));
        },
        [dispatch]
    );
  

    const onReg = useCallback(
        function onReg(name: string, email: string, password: string) {
            dispatch(fetchAuth(email, password, name)); // name дожен быть последим, т.к. это не обязятельный параметр
        },
        [dispatch]
    );
        

    const onForgotPassword = useCallback(
        function(email: string) {
            dispatch(forgotPassword(email)); // sending email
            dispatch(authActions.setActiveTabIndex(0));
        },
        [dispatch]
    );

       
    return (
        <Modal onBackdropClick={hideAuthModal}>
            <Card>
                {
                    isLoading ? <Spinner/> :
                    < Tabs tabs={ [
                        {name: 'Login', el: <LoginForm onLogin={onLogin} onCancel={hideAuthModal}/>},
                        {name: 'Register', el: <RegistrationForm onReg={onReg} onCancel={hideAuthModal}/>},
                        {name: 'Forgot Password?', el: <ForgotPassForm onForgotPassword={onForgotPassword} onCancel={hideAuthModal}/>},
                    ] } 
                    onToggleTab={onToggleTab}
                    activeTabIndex={activeTabIndex}
                    />
                }
            </Card>
        </Modal>
    )
}

export default AuthModal;