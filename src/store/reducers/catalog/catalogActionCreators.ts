import { AppDispatch } from "../../store";
import { AxiosError } from "axios";
import { catalogActions } from './catalog';
import { notificationActions } from "../notifications";

export function get(searchParams?: URLSearchParams) {
    return async function(dispatch: AppDispatch) {
        try {
            // dispatch(productsTableActions.setIsLoading(true));
            // const response = await ProductsService.getManyProducts(searchParams);
            // const products = response.data;
            // dispatch(productsTableActions.getManySuccess(products));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
        }
        finally {
            dispatch(catalogActions.setCatalogIsLoading(false));
        }
    }
}