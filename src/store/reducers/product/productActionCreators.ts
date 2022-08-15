import {AppDispatch} from '../../store';
import { AxiosError } from 'axios';
import { productActions } from './product';
import { notificationActions } from '../notifications';
import ProductService from '../../../services/ProductsService';

export function getProduct(productId: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(productActions.setIsLoading(true));
            const response = await ProductService.getOne(productId);
            const product = response.data;
            dispatch(productActions.setProduct(product));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
        }
        finally {
            dispatch(productActions.setIsLoading(false));
        }
    }
}