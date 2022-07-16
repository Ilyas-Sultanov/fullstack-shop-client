import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRoleDataItem } from '../../../types/RoleTypes';

type RoleState = {
    isLoading: boolean,
    roles: IRoleDataItem[]
    error: string,
}

const initialState: RoleState = {
    isLoading: false,
    roles: [],
    error: '',
}

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        setRolesLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
            state.error = '';
        },
        setRolesError(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
        getRolesSuccess(state, action: PayloadAction<IRoleDataItem[]>) {
            state.isLoading = false;
            state.error = '';
            state.roles = action.payload;
        }
    }
});

export const rolesActions = rolesSlice.actions;
export default rolesSlice.reducer;