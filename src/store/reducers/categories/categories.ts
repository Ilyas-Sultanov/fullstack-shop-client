import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResponseCategory } from '../../../types/CategoryTypes'

interface ICategoriesState {
    categoriesIsLoading: boolean
    categories: Array<IResponseCategory>
    
}

const initialState: ICategoriesState = {
    categoriesIsLoading: false,
    categories: [],
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setIsLoading(state, action:PayloadAction<boolean>) {
            state.categoriesIsLoading = action.payload;
        },
        getCategoriesSuccess(state, actions: PayloadAction<Array<IResponseCategory>>) {
            state.categories = actions.payload;
        },
    }
});

export const categoriesActions = categoriesSlice.actions;
export default categoriesSlice.reducer;