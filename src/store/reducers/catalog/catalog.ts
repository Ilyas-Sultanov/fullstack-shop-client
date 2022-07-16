import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CatalogState = {
    catalogIsLoading: boolean
    activeCategoryId: string | null
}

const initialState: CatalogState = {
    catalogIsLoading: false,
    activeCategoryId: null
}

const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        setCatalogIsLoading(state, action: PayloadAction<boolean>) {
            state.catalogIsLoading = action.payload;
        },
        setActiveCategoryId(state, action:PayloadAction<string>) {
            state.activeCategoryId = action.payload;
        },
    }
});


export default catalogSlice.reducer;
export const catalogActions = catalogSlice.actions;