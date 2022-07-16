import { AppDispatch } from "../../store";
import { productsActions } from "./products";
import { notificationActions } from "../notifications";
import ProductsService from "../../../services/ProductsService";
import { AxiosError } from "axios";

export function getManyProducts(searchParams?: URLSearchParams) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(productsActions.setProductsIsLoading(true));
            const response = await ProductsService.getManyProducts(searchParams);
            const products = response.data;
            dispatch(productsActions.getManySuccess(products));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
        }
        finally {
            dispatch(productsActions.setProductsIsLoading(false));
        }
    }
}


export function getHighestPrice() {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(productsActions.setProductsIsLoading(true));
            const response = await ProductsService.getHighestPrice();
            const highestPrice = response.data;
            dispatch(productsActions.setHighestPrice(highestPrice));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
        }
        finally {
            dispatch(productsActions.setProductsIsLoading(false));
        }
    }
}