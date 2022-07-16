import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IProductsData} from '../../../types/Products';

interface IProductsTableState {
    productsIsLoading: boolean
    highestPrice: number
    productsData: IProductsData
}

const initialState: IProductsTableState = {
    productsIsLoading: false,
    highestPrice: 1,
    productsData: {
        totalNumberOfMatches: 0,
        currentPage: 1,
        limit: 10,
        link: '',
        data: [],
    },
}

const productsSlice = createSlice({
    name: 'productList',
    initialState,
    reducers: {
        setProductsIsLoading(state, action:PayloadAction<boolean>) {
            state.productsIsLoading = action.payload;
        },
        setHighestPrice(state, action:PayloadAction<number>) {
            state.highestPrice = action.payload;
        },
        getManySuccess(state, action: PayloadAction<IProductsData>) {
            state.productsData = action.payload;
        },

    }
});

export const productsActions = productsSlice.actions;
export default productsSlice.reducer;