import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IProductsData} from '../../../types/Products';

interface IProductsTableState {
    isInitial: boolean
    productsTableIsLoading: boolean
    isRedownload: boolean
    error: string
    isShowCategoryListModal: boolean
    highestPrice: number
    productsData: IProductsData
}

const initialState: IProductsTableState = {
    isInitial: true,
    productsTableIsLoading: false,
    isRedownload: false,
    error: '',
    isShowCategoryListModal: false,
    highestPrice: 1,
    productsData: {
        totalNumberOfMatches: 0,
        currentPage: 1,
        limit: 10,
        link: '',
        data: [],
    },
}

const productsTableSlice = createSlice({
    name: 'productList',
    initialState,
    reducers: {
        setIsLoading(state, action:PayloadAction<boolean>) {
            state.productsTableIsLoading = action.payload;
            if (state.error) {
                state.error = '';
            }
        },
        setIsInitial(state, action:PayloadAction<boolean>) {
            state.isInitial = action.payload;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        isShowCategoryListModal(state, action:PayloadAction<boolean>) {
            state.isShowCategoryListModal = action.payload;
        },
        setHighestPrice(state, action:PayloadAction<number>) {
            state.highestPrice = action.payload;
        },
        getManySuccess(state, action: PayloadAction<IProductsData>) {
            if (state.isRedownload === true) state.isRedownload = false;
            if (state.error) state.error = '';
            state.productsData = action.payload;
        },

    }
});

export const productsTableActions = productsTableSlice.actions;
export default productsTableSlice.reducer;