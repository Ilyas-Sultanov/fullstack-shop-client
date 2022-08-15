import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResponseCategory } from '../../../types/CategoryTypes';

type CategoriesMenuStateType = {
    categoriesMenuIsLoading: boolean
    categories: Array<IResponseCategory>
    isShowCategoriesMenu: boolean
}

const initialState: CategoriesMenuStateType = {
    categoriesMenuIsLoading: false,
    categories: [],
    isShowCategoriesMenu: false,
}


const categoriesMenuSlice = createSlice({
    name: 'categoriesMenu',
    initialState,
    reducers: {
        setCategoriesMenuIsLoading(state, action: PayloadAction<boolean>) {
            state.categoriesMenuIsLoading = action.payload;
        },
        setCategories(state, action: PayloadAction<Array<IResponseCategory>>) {
            state.categories = action.payload;
        },
        setIsShowCategoriesMenu(state, action: PayloadAction<boolean>) {
            state.isShowCategoriesMenu = action.payload;
        }
    }
});


export const categoriesMenuActions = categoriesMenuSlice.actions;
export default categoriesMenuSlice.reducer;