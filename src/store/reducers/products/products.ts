import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IProductsData} from '../../../types/Products';

interface IProductsState {
    productsIsLoading: boolean
    highestPrice: number
    productsData: IProductsData
    isShowFilter: boolean
}

const initialState: IProductsState = {
    productsIsLoading: false,
    highestPrice: 1,
    productsData: {
        totalNumberOfMatches: 0,
        currentPage: 1,
        limit: 10,
        link: '',
        data: [],
    },
    isShowFilter: false,
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProductsIsLoading(state, action:PayloadAction<boolean>) {
            state.productsIsLoading = action.payload;
        },
        setHighestPrice(state, action:PayloadAction<number>) {
            state.highestPrice = action.payload;
        },
        setProducts(state, action: PayloadAction<IProductsData>) {
            state.productsData = action.payload;
        },
        setIsShowFilter(state, action: PayloadAction<boolean>) {
            state.isShowFilter = action.payload;
        },
    }
});

export const productsActions = productsSlice.actions;
export default productsSlice.reducer;