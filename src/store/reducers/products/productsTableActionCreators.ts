import {AppDispatch} from '../../store';
import { AxiosError } from 'axios';
import { productsTableActions } from './productsTable';
import { createProductActions } from './createProduct';
import { editProductActions } from './editProduct';
import { notificationActions } from '../notifications';
import ProductsService from '../../../services/ProductsService';
import CategoryServices from '../../../services/CategoryServices';
import {urlToFile} from '../../../helpers/urlToFile';


export function createProduct(formData: FormData) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(createProductActions.setCreateProductIsLoading(true));
            await ProductsService.createProduct(formData);
            dispatch(notificationActions.add({type: 'success', message: 'Product created'}));
            dispatch(createProductActions.cleanProductState());
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
            dispatch(createProductActions.setIsvalid(false));
            dispatch(editProductActions.setProductIsLoading(false));
        }
    }
}


export function getManyProducts(searchParams?: URLSearchParams) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(productsTableActions.setIsLoading(true));
            const response = await ProductsService.getManyProducts(searchParams);
            const products = response.data;
            dispatch(productsTableActions.getManySuccess(products));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(productsTableActions.setError(e.response!.data.message as string));
        }
        finally {
            dispatch(productsTableActions.setIsLoading(false));
        }
    }
}


export function getOneProduct(productId: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(editProductActions.setProductIsLoading(true));
            const response = await ProductsService.getOne(productId);
            const product = response.data;
            const imageFileList = await urlToFile(product.images);
            dispatch(editProductActions.getProductSuccess(product));
            dispatch(editProductActions.setImageFiles(imageFileList));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
        }
        finally {
            dispatch(editProductActions.setProductIsLoading(false));
        }
    }
}


export function editProduct(formData: FormData) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(editProductActions.setProductIsLoading(true));
            await ProductsService.editProduct(formData);
            dispatch(notificationActions.add({type: 'success', message: 'Successfully edited'}));
            dispatch(editProductActions.editProductSuccess());
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
            dispatch(editProductActions.setProductIsLoading(false));
        }
    }
}


export function deleteOneProduct(_id: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(editProductActions.setProductIsLoading(true));
            await ProductsService.deleteOneProduct(_id);
            dispatch(notificationActions.add({type: 'success', message: 'Successfully deleted'}));
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
            dispatch(editProductActions.setProductIsLoading(false));
        }
    }
}


// Общие для createProduct и editProduct экшены

export function getCategory(_id: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(createProductActions.setCreateProductIsLoading(true));
            const response = await CategoryServices.getOne(_id);
            const category = response.data;
            dispatch(createProductActions.getCategorySuccess(category));
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
            dispatch(editProductActions.setProductIsLoading(false));
        }
    }
}


export function getHighestPrice() {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(productsTableActions.setIsLoading(true));
            const response = await ProductsService.getHighestPrice();
            const highestPrice = response.data;
            dispatch(productsTableActions.setHighestPrice(highestPrice));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(notificationActions.add({type: 'error', message: e.response!.data.message as string}));
        }
        finally {
            dispatch(productsTableActions.setIsLoading(false));
        }
    }
}