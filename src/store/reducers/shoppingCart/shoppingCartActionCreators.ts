import { INewOrder } from '../../../types/Order';
import { AppDispatch } from '../../store';
import { shoppingCartActions } from './shoppingCart';
import { AxiosError } from 'axios';
import { notificationActions } from '../notifications';
import OrderService from '../../../services/OrderService';

export function createOrder(newOrder: INewOrder) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(shoppingCartActions.setShoppingCartIsLoading(true));
            await OrderService.createOrder(newOrder);
            dispatch(shoppingCartActions.removeAll());
            dispatch(notificationActions.add({type: 'success', message: 'Order created'}));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message}));
        }
        finally {
            dispatch(shoppingCartActions.setShoppingCartIsLoading(false));
        }
    }
}

