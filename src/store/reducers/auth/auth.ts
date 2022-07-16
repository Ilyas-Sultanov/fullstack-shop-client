import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../../../types/IUser";

type AuthState = {
    isShowAuthModal: boolean,
    activeTabIndex: number, // индекс активного таба в AuthModal
    isAuth: boolean,
    isLoading: boolean,
    error: string,
    user: IUser | null,
}

const initialState: AuthState = {
    isShowAuthModal: false,
    activeTabIndex: 0,
    isAuth: false,
    isLoading: true,
    error: '',
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsShowAuthModal(state, action: PayloadAction<boolean>) {
            state.isShowAuthModal = action.payload;
        },
        setAuthIsLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        authFetchingSuccess(state, action: PayloadAction<IUser>) {
            state.isAuth = true;
            state.user = action.payload;
            state.isShowAuthModal = false;
            if (state.error) state.error = ''; 
        },
        setAuthError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        authLogoutSuccess(state) {
            state.isAuth = false;
            state.user = {} as IUser;
            if (state.error) state.error = ''; 
        },
        setActiveTabIndex(state, action: PayloadAction<number>) {
            state.activeTabIndex = action.payload;
        },
    }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;