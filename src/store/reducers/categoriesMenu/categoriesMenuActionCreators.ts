import { AppDispatch } from "../../store";
import { AxiosError } from 'axios';
import { notificationActions } from "../notifications";
import { categoriesMenuActions } from './categoriesMenu';
import CategoryServices from "../../../services/CategoryServices";


export function getCategories() {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(categoriesMenuActions.setCategoriesMenuIsLoading(true));
            const response = await CategoryServices.getAll();
            const categories = response.data;
            dispatch(categoriesMenuActions.setCategories(categories));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
        }
        finally {
            dispatch(categoriesMenuActions.setCategoriesMenuIsLoading(false));
        }
    }
}