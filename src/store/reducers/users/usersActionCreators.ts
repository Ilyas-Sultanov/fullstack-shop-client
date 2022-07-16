import {AppDispatch} from '../../store';
import { AxiosError } from 'axios';
import { usersActions } from './users';
import UserService from '../../../services/UserSrvice';
import { IEditingUser } from '../../reducers/users/users';

export function getManyUsers(searchParams?: URLSearchParams) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(usersActions.setIsLoading(true));
            const response = await UserService.getManyUsers(searchParams);
            const users = response.data;
            dispatch(usersActions.getSuccess(users));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(usersActions.setError(e.response!.data.message as string));
        }
        finally {
            dispatch(usersActions.setIsLoading(false));
        }
    }
}

export function getOneUser(_id: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(usersActions.setIsLoading(true));
            const response = await UserService.getOneUser(_id);
            const user = response.data;
            dispatch(usersActions.setEditingUser(user));
            dispatch(usersActions.setIsShowEditUserModal(true));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(usersActions.setError(e.response!.data.message as string));
        }
        finally {
            dispatch(usersActions.setIsLoading(false));
        }
    }
}

export function editUser(editedUser: IEditingUser) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(usersActions.setIsLoading(true));
            await UserService.editUser(editedUser);
            dispatch(usersActions.editSuccess()); 
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(usersActions.setError(e.response!.data.message as string));
            dispatch(usersActions.setIsShowEditUserModal(false));
        }
        finally {
            dispatch(usersActions.setIsLoading(false));
        }
    }
}

export function deleteOneUser(_id: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(usersActions.setIsLoading(true));
            await UserService.deleteOneUser(_id);
            dispatch(usersActions.deleteSuccess(_id));
        }
        catch (err) {
            const message = (err as AxiosError).response?.data.message;
            dispatch(usersActions.setError(message));
        }
        finally {
            dispatch(usersActions.setIsLoading(false));
        }
    }
}