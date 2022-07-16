import { AppDispatch } from '../../store';
import { authActions } from '../auth/auth';
import { notificationActions } from '../notifications';
import AuthService from '../../../services/AuthService';
import axios, { AxiosError, AxiosResponse } from 'axios';
import AuthResponse from '../../../types/response/AuthResponse';
import { API_URL } from '../../../http';


export function checkAuth() {
    return async function(dispatch: AppDispatch) {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                dispatch(authActions.setAuthIsLoading(true));
                const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {withCredentials: true});
                localStorage.setItem('token', response.data.accessToken);
                const user = response.data.user;
                dispatch(authActions.authFetchingSuccess(user));
            }
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(authActions.setAuthError(e.response!.data.message as string));
        }
        finally {
            dispatch(authActions.setAuthIsLoading(false));
        }
    }    
}

export function fetchAuth(email: string, password: string, name?: string) { // не обязательные параметры обязательно в конце
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(authActions.setAuthIsLoading(true));
            let response: AxiosResponse<AuthResponse>;
            if (!name) response = await AuthService.login(email, password); // если  не передали name, значит вызываем логин
            else response = await AuthService.registration(name, email, password); // если передали name, значит вызываем регистрацию
            
            localStorage.setItem('token', response.data.accessToken);

            const user = response.data.user;
            dispatch(authActions.authFetchingSuccess(user));
        }
        catch (err) { // Обработка ошибок axios typescript
            // err.response?.data?.message
            let e = err as AxiosError;
            dispatch(authActions.setAuthError(e.response!.data.message as string));
        }
        finally {
            dispatch(authActions.setAuthIsLoading(false));
        }
    }
}

export function fetchLogOut() {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(authActions.setAuthIsLoading(true));
            await AuthService.logout();
            localStorage.removeItem('token');
            dispatch(authActions.authLogoutSuccess());
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(authActions.setAuthError(e.response!.data.message as string));
        }
        finally {
            dispatch(authActions.setAuthIsLoading(false));
        }
    }
}

export function forgotPassword(email: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(authActions.setAuthIsLoading(true));
            await AuthService.forgotPassword(email);
            dispatch(notificationActions.add({type: 'success', message: 'An email has been sent to you'})); 
            dispatch(authActions.setIsShowAuthModal(false));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(authActions.setAuthError(e.response!.data.message as string));
        }
        finally {
            dispatch(authActions.setAuthIsLoading(false));
        }
    }
}