import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DBBrand } from '../../../types/Brand'

type BrandsState = {
    brandsIsLoading: boolean
    brands: Array<DBBrand>
}

const initialState: BrandsState = {
    brandsIsLoading: false,
    brands: [],
}

const brandsSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {
        setBrandsIsLoading(state, action:PayloadAction<boolean>) {
            state.brandsIsLoading = action.payload;
        },
        setBrands(state, action: PayloadAction<Array<DBBrand>>) {
            state.brands = action.payload;
        }
    }
});

export const brandsActions = brandsSlice.actions;
export default brandsSlice.reducer;