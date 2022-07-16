import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResponseCategory } from '../../../types/CategoryTypes';
import { IMultilevelMenu } from '../../../components/UI/MultilevelMenu/MultilevelMenu';

type CategoriesMenuStateType = {
    categoriesMenuIsLoading: boolean
    categoriesMenuIsInit: boolean          // нужно для анимации, если true, то анимация не отрабатывает (css класс с анимацией не добавляется).
    categories: Array<IResponseCategory>
    isShowCategoriesMenu: boolean
    selectedItem?: IMultilevelMenu
}

const initialState: CategoriesMenuStateType = {
    categoriesMenuIsLoading: false,
    categoriesMenuIsInit: true,
    categories: [],
    isShowCategoriesMenu: false,
    selectedItem: undefined,
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
            if (state.categoriesMenuIsInit) {
                state.categoriesMenuIsInit = false;
            }
        },
        setSelectedItem(state, action: PayloadAction<IMultilevelMenu | undefined>) {
            state.selectedItem = action.payload;
        },
    }
});


export const categoriesMenuActions = categoriesMenuSlice.actions;
export default categoriesMenuSlice.reducer;