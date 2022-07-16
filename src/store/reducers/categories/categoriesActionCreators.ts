import {AppDispatch} from '../../store';
import { AxiosError } from 'axios';
import { categoriesActions } from './categories';
import { notificationActions } from '../notifications';
import CategoryService from '../../../services/CategoryServices';

export function getAllCategories() {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(categoriesActions.setIsLoading(true));
            const response = await CategoryService.getAll();
            const categories = response.data;
            dispatch(categoriesActions.getCategoriesSuccess(categories));
        }
        catch (err) {
            const e = err as AxiosError;
            const responseData = e.response ? e.response.data : null;
            if (responseData) {
                dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
            }
            else {
                dispatch(notificationActions.add({type: 'error', message: 'Server error'}));
            }
        }
        finally {
            dispatch(categoriesActions.setIsLoading(false));
        }
    }
}