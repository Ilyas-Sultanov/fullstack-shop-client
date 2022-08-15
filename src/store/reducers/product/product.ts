import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPreparedForUIProduct } from '../../../types/Products';

interface IProductState {
    productIsLoading: boolean
    product?: IPreparedForUIProduct, 
}

const initialState: IProductState = {
    productIsLoading: false,
    product: undefined, 
};

const ProductSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setIsLoading(state, action: PayloadAction<boolean>) {
            state.productIsLoading = action.payload;
        },
        setProduct(state, action: PayloadAction<IPreparedForUIProduct>) {
            state.product = action.payload;
        },
    }
});

export const productActions = ProductSlice.actions;
export default ProductSlice.reducer;