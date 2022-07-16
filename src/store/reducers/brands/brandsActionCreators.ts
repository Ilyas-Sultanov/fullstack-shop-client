import { AppDispatch } from "../../store";
import { AxiosError } from "axios";
import { notificationActions } from "../notifications";
import { brandsActions } from '../brands/brands'
import BrandService from '../../../services/BrandService'

export function createBrand(name: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(brandsActions.setBrandsIsLoading(true));
            await BrandService.create(name);                     // создали бренд
            const response = await BrandService.getAll();        // запросили все бренды
            const brands = response.data;
            dispatch(brandsActions.setBrands(brands));
            dispatch(notificationActions.add({type: 'success', message: 'Brand successfully created'}));
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
            dispatch(brandsActions.setBrandsIsLoading(false));
        }
    }
}

export function getBrands() {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(brandsActions.setBrandsIsLoading(true));
            const response = await BrandService.getAll();
            const brands = response.data;
            dispatch(brandsActions.setBrands(brands));
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
            dispatch(brandsActions.setBrandsIsLoading(false));
        }
    }
}

export function editBrand(_id: string, name: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(brandsActions.setBrandsIsLoading(true));
            await BrandService.edit(_id, name);
            const response = await BrandService.getAll();
            const brands = response.data;
            dispatch(brandsActions.setBrands(brands));
            dispatch(notificationActions.add({type: 'success', message: 'Brand successfully edited'}));
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
            dispatch(brandsActions.setBrandsIsLoading(false));
        }
    }
}

export function deleteBrand(_id: string) {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(brandsActions.setBrandsIsLoading(true));
            await BrandService.delete(_id);
            const response = await BrandService.getAll();
            const brands = response.data;
            dispatch(brandsActions.setBrands(brands));
            dispatch(notificationActions.add({type: 'success', message: 'Brand successfully deleted'}));
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
            dispatch(brandsActions.setBrandsIsLoading(false));
        }
    }
}